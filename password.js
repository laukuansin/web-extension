$(document).ready(function() {


    function toggleImgVisible() {
        let passwordInput = $("#passwordInput");
        let imgVisible = $('#imgVisible');

        if (passwordInput.prop('type') === "password") {
            passwordInput.prop('type', "text");
            imgVisible.attr('src', 'images/hide.png');
        } else {
            passwordInput.prop('type', "password");
            imgVisible.attr('src', 'images/show.png');
        }
    }


    function isCheckboxChecked() {
        let cbs = Object.values($('#cbGroup :input[type=checkbox]'));
        return cbs.reduce(function(result, cb) {
            return result |= cb.checked;
        }, false);
    }


    function viewHistory() {
        browser.tabs.create({ url: browser.extension.getURL('history.html') });
    }


    function copyPassword(passGen) {
        $("#passwordInput").select();
        document.execCommand("copy");
        passGen.exportClipboardHistoryToLocal($('#passwordInput').val());
    }


    function setCurrentOptions(passGen) {
        passGen.incNumbers = $('#cbNumbers').is(":checked");
        passGen.incLowerCase = $('#cbLowerCase').is(":checked");
        passGen.incUpperCase = $('#cbUpperCase').is(":checked");
        passGen.incSymbol = $('#cbSymbols').is(":checked");
        passGen.incSpecialChar = $('#cbSpecialChars').is(':checked');
        passGen.noRepeatChar = $('#cbDontRepeatChars').is(':checked');
        passGen.passLen = $('#passLenInput').val();
        passGen.excChar.enable = $('#cbExcludeChars').is(':checked');
        passGen.excChar.char = $('#excludeInput').val();
        passGen.expiryNotificaiton = $('#cbExpiryNotification').is(':checked');
        passGen.exportOptionInLocal();
    }


    function loadCurrentOptions(passGen) {
        $('#cbNumbers').attr("checked", passGen.incNumbers);
        $('#cbLowerCase').attr("checked", passGen.incLowerCase);
        $('#cbUpperCase').attr("checked", passGen.incUpperCase);
        $('#cbSymbols').attr("checked", passGen.incSymbol);
        $('#cbSpecialChars').attr('checked', passGen.incSpecialChar);
        $('#cbDontRepeatChars').attr('checked', passGen.noRepeatChar);
        $('#passLenInput').val(passGen.passLen);
        $('#excludeInput').val(passGen.excChar.char);

        $('#cbExpiryNotification').attr('checked', passGen.expiryNotificaiton);
        if (passGen.excChar.enable)
            $('#cbExcludeChars').attr('checked', 'checked');
        else
            $('#excludeInput').attr('disabled', true);
    }


    function alertPassGenError(error) {
        let msg = '';
        if (error === PasswordGenerator.PASS_GEN_STATUS.PASS_LEN_TOO_SHORT)
            msg = `The minimum password length is ${PasswordGenerator.DEFAULT_MIN_LEN}`;
        else if (error === PasswordGenerator.PASS_GEN_STATUS.PASS_LEN_EXCEED)
            msg = 'It is impossible to generate a password based on your current setting.';
        alert(msg);
    }


    async function savePassword(passGen) {
        var pwd = $('#passwordInput').val();
        if (pwd === "") return;

        let tabs = await browser.tabs.query({ currentWindow: true, active: true });
        let domain = (new URL(tabs[0].url)).hostname;

        let expiredDate = new Date();
        expiredDate.setMonth(expiredDate.getMonth() + 3);

        await passGen.exportPasswordHistoryToLocal(expiredDate, domain);
        document.querySelector('#btnRemind').innerHTML = 'Saved';
        document.querySelector('#btnRemind').style.color = 'green';
        document.querySelector('#btnRemind').disabled = true;


    }

    function generatePassword(passGen) {
        const [msg, password] = passGen.generatePassword();
        if (msg === PasswordGenerator.PASS_GEN_STATUS.SUCCESS) {
            $('#passwordInput').val(password);
            document.querySelector('#btnRemind').innerHTML = 'Save Password';
            document.querySelector('#btnRemind').style.color = 'black';
            document.querySelector('#btnRemind').disabled = false;

        } else {
            alertPassGenError(msg);
        }
    }

    async function init() {
        let passGen = new PasswordGenerator();
        await passGen.importOptionFromLocal();

        $('#cbGroup :input[type=checkbox]').click(function() {
            let disable = !isCheckboxChecked();
            $('#btnGenerate').attr('disabled', disable);
            $('#btnReminder').attr('disabled', disable);
        });

        $('#cbExcludeChars').change(function() {
            $('#excludeInput').attr('disabled', !this.checked);
        });

        $('input:checkbox').change(function() {
            setCurrentOptions(passGen);
        });

        $('#excludeInput').on("input", () => setCurrentOptions(passGen));


        $('#btnCopy').click(() => copyPassword(passGen));
        $('#btnHistory').click(viewHistory);
        $("#imgVisible").click(toggleImgVisible);
        $('#btnRemind').click(() => savePassword(passGen));
        $('#btnGenerate').click(() => generatePassword(passGen));

        loadCurrentOptions(passGen);
        $('#passwordInput').val(passGen.generatePassword()[1]);
    }

    init();
});
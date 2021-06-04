const DEFAULT_OPTIONS = {
    '#cbNumbers': true,
    '#cbLowerCase': true,
    '#cbUpperCase': true,
    '#cbSymbols': false,
    '#cbSpecialChars': false
};

const DEFAULT_PASS_LEN = 10;
const DEFAULT_MIN_LEN = 6;


$(document).ready(function() {
    var btnGenerate = $('#btnGenerate');
    var btnRemind = $('#btnRemind');

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

    function init() {
        $('#cbGroup :input[type=checkbox]').click(function() {
            let disable = !isCheckboxChecked();
            btnGenerate.attr('disabled', disable);
            btnRemind.attr('disabled', disable);
        });

        $('#cbExcludeChars').change(function() {
            $('#excludeInput').attr('disabled', !this.checked);
        });

        $('#excludeInput').attr('disabled', true);

        $('#btnGenerate').click(function() {
            $('#passwordInput').val(generatePassword());
        });

        $("#imgVisible").click(toggleImgVisible);

        $('#btnCopy').click(function() {
            $("#passwordInput").select();
            document.execCommand("copy");
        });

        for (const [cbID, enable] of Object.entries(DEFAULT_OPTIONS))
            $(cbID).attr('checked', enable);

        $('#passLenInput').val(DEFAULT_PASS_LEN);
        $('#minPassLenLbl').text(DEFAULT_MIN_LEN);
        $("#versionName").text(browser.runtime.getManifest().version);
    }

    function getPool() {
        let options = {
            '#cbNumbers': '0123456789',
            '#cbLowerCase': 'abcdefghijklmnopqrstuvwxyz',
            '#cbUpperCase': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '#cbSymbols': '@#$%^&*()+-=!_',
            '#cbSpecialChars': '~`{}[]|\\\"\':;?/><.,'
        };

        let isExcludeCharEnable = $('#cbExcludeChars').is(':checked');
        let excludeVal = $('#excludeInput').val();

        if (isExcludeCharEnable)
            for (const [cbID, pool] of Object.entries(options))
                options[cbID] = pool.replace(new RegExp(`[${excludeVal}]`, 'g'), '');

        let charPool = [];
        for (const [cbID, pool] of Object.entries(options))
            if ($(cbID).is(':checked'))
                charPool.push(pool);

        return charPool;
    }


    function generatePassword() {
        let passLen = Number($('#passLenInput').val());

        if (passLen < DEFAULT_MIN_LEN) {
            alert("The minimum password length is 6");
            return '';
        }

        let charPool = getPool();
        let charPoolTotalLen = charPool.reduce(function(result, pool) {
            return result += pool.length;
        }, 0);

        let dontRepeatChar = $('#cbDontRepeatChars').is(':checked');
        if (dontRepeatChar && charPoolTotalLen < passLen) {
            alert("With your current setting, the password length should not exceed " +
                charPoolTotalLen + " characters");
            return '';
        }

        let password = '';
        let usedChar = new Set();

        for (let index = 0; password.length < passLen; index++) {
            pool = charPool[index % charPool.length];
            rand = Math.floor(Math.random() * pool.length);

            if (!dontRepeatChar || !usedChar.has(pool[rand])) {
                let character = pool[rand];
                password += character;
                usedChar.add(character)
                continue;
            }

            for (let i = 0; i < pool.length; i++) {
                if (usedChar.has(pool[i]))
                    continue;

                let character = pool[i];
                password += character;
                usedChar.add(character)
                break;
            }
        }
        return password;
    }

    init();
});
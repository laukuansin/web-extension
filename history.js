$(document).ready(function() {

    function clearClipboardHistory(index) {
        if (localStorage.TLPassGeneratorPass === undefined)
            return;

        let passList = JSON.parse(localStorage.TLPassGeneratorPass);
        passList.splice(passList.length - 1 - index, 1);
        localStorage.TLPassGeneratorPass = JSON.stringify(passList);
    }

    async function copyToClipboard(password) {
        try {
            await navigator.clipboard.writeText(password);
        } catch (err) {
            alert('Error in copying text: ', err);
        }
    }

    function createPasswordHistoryTable(passList) {
        for (const [domain, expiredDate] of Object.entries(passList)) {
            $('#passHistoryTable > tbody:last-child').append(
                `
                <tr>
                    <td><a href='${domain}'>${domain}</a></td>
                    <td>${(new Date(expiredDate)).toLocaleString()}</td>
                </tr> 
                `
            );
        }
    }


    function createClipboardHistoryTable(passList) {
        passList.forEach(pass => {
            $('#clipboardHistory > tbody:last-child').append(
                `
                <tr>
                    <td>${pass.password}</td>
                    <td>${(new Date(pass['date'])).toLocaleString()}</td>
                    <td>
                        <button class="btnCopy btn btn-link">Copy</button> 
                        <button class="btnRemove btn btn-link text-danger">Remove</button>
                    </td>
                </tr> 
                `
            );

            let lastRow = $('#clipboardHistory tr:last');
            lastRow.find('.btnCopy').click(async function() {
                await copyToClipboard(pass.password);
            });

            lastRow.find('.btnRemove').click(function() {
                clearClipboardHistory(lastRow.index());
                lastRow.remove();
            });
        });
    };

    async function init() {
        let passGen = new PasswordGenerator();
        await passGen.importOptionFromLocal();

        $('#btnClearClipistory').click(function() {
            $('#clipboardHistory tbody').empty();
            passGen.clearClipboardHistory();
        });

        $('#btnClearPassHistory').click(function() {
            $('#passHistoryTable tbody').empty();
            passGen.clearPasswordHistory();
        });

        $("#versionName").text(browser.runtime.getManifest().version);

        createPasswordHistoryTable(
            await passGen.importPasswordHistoryFromLocal());

        createClipboardHistoryTable(
            (await passGen.importClipboardHistoryFromLocal()).reverse());
    }

    init();
});
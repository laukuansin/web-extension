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

    function createTable(passList) {
        passList.forEach(pass => {
            $('#table > tbody:last-child').append(
                `
                <tr>
                    <td>${pass.password}</td>
                    <td>${(new Date(pass['date'])).toUTCString()}</td>
                    <td>
                        <button class="btnCopy btn btn-link">Copy</button> 
                        <button class="btnRemove btn btn-link text-danger">Remove</button>
                    </td>
                </tr> 
                `
            );

            let lastRow = $('#table tr:last');
            lastRow.find('.btnCopy').click(async function() {
                await copyToClipboard(pass.password);
            });

            lastRow.find('.btnRemove').click(function() {
                clearClipboardHistory(lastRow.index());
                lastRow.remove();
            });
        });
    };

    function init() {
        $('#btnClearAll').click(function() {
            $('#table tbody').empty();

            if (localStorage.TLPassGeneratorPass)
                localStorage.TLPassGeneratorPass = JSON.stringify([]);
        });

        $("#versionName").text(browser.runtime.getManifest().version);

        if (localStorage.TLPassGeneratorPass !== undefined) {
            let passList = JSON.parse(localStorage.TLPassGeneratorPass);
            passList.reverse();
            createTable(passList);
        }
    }

    init();
});
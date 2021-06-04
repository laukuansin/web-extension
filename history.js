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
                    <td>${pass['date']}</td>
                    <td>
                        <button class="btnCopy">Copy</button> 
                        <button class="btnRemove">Remove</button>
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

        if (localStorage.TLPassGeneratorPass !== undefined) {
            let passList = JSON.parse(localStorage.TLPassGeneratorPass);
            passList.reverse();
            createTable(passList);
        }
    }

    init();
});
$(document).ready(function() {
   
    function init() {
        var button=document.querySelector('table');
        button.addEventListener("click",buttonHandle);
        function buttonHandle(e)
        {
            if(e.target.classList.contains("btnCopy"))
            {
                copy(e);
            }
            if(e.target.classList.contains("btnRemove"))
            {
               remove(e);
            }
            else{
                return;
            }
        }
        async function copy(e)
        {
            row=e.target.closest("tr");
            password=row.cells[0].innerHTML;
            try {
                await navigator.clipboard.writeText(password);
                alert('Password copied to clipboard');
            } catch(err) {
                alert('Error in copying text: ', err);
            }
        }
        function remove(e)
        {
            row=e.target.closest("tr");
            password=row.cells[0].innerHTML;

            row.remove();
            browser.storage.local.remove("Password:"+password);
            alert("Remove successful");
        }
        browser.storage.local.get().then(function (result){
            let results=[];
        
            for(const key of Object.keys(result))
            {
                if(key.startsWith('Password:'))
                    results.push({'key':key,'obj':result[key]});
            }
            results.sort((x,y)=>{y.obj['date']-x.obj['date']});
            createTable(results);
        });
        
    }
    function createTable(results) {
       
        for(let result of results)
        {
            var table = document.getElementById("table");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
    
            row.insertCell(0).innerHTML= result.obj['password'];
            row.insertCell(1).innerHTML= result.obj['date'];
            row.insertCell(2).innerHTML= '<button class="btnCopy" id="btnCopy">Copy</button> <button class="btnRemove">Remove</button>';
        }
      
    };

    init();
});



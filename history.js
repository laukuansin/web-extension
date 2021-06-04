browser.storage.local.get().then(function (result){
    let results=[];

    for(const key of Object.keys(result))
    {
        if(key.startsWith('Password:'))
            results.push({'key':key,'obj':result[key]});
    }
   results.sort((x,y)=>x.obj['date']-y.obj['date']);
    alert(obj=results[0].obj['date']);
});


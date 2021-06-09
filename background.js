setInterval(checkPasswordDuration,1000);

function checkPasswordDuration()
{
    browser.storage.local.get().then(function (result){
        for(const key of Object.keys(result))
        {
            if(key.startsWith('Remind:'))
            {
                let current = new Date();
                dueDate= new Date(result[key]['date']);
                let leftDate=dueDate-current;
                //dueDate.setMonth(dueDate.getMonth()-3);
                dueDate.setMinutes(dueDate.getMinutes()-1);

                if(leftDate<=0)
                {
                    pwd=result[key]['password'];
                    message="You have create "+pwd+" password at "+dueDate+", it has been over 3 month. It is a kindly reminder to remind you change a new password for the security purpose. "
                    browser.notifications.create("tlpasswordgeneratornotification", {
                        type: "basic",
                        iconUrl: "images/password-64.png",
                        title: "TL Password Generator",
                        message,
                    });

                   browser.storage.local.remove(key);
                }
            }    
        }
    });
}
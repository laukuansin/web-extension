async function checkPasswordExpiry() {
    let passGen = new PasswordGenerator();
    await passGen.importOptionFromLocal();

    if (!passGen.expiryNotificaiton)
        return;

    let expiredPassList = await passGen.getExpiredPassword();
    if (expiredPassList.lenght === 0) return;

    expiredPassList.forEach(pass => {
        const [domain, _] = pass;
        browser.notifications.create("tlpasswordgeneratornotification", {
            type: "basic",
            iconUrl: "images/password-64.png",
            title: "TL Password Generator",
            message: `Your password set in ${domain} has expired. Kindly change your password to secure your account`,
        });
    });
}

checkPasswordExpiry();
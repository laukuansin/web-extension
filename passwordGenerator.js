class PasswordGenerator {
    static get DEFAULT_PASS_LEN() { return 10 };
    static get DEFAULT_MIN_LEN() { return 6 };
    static get PASS_GEN_STATUS() {
        return Object.freeze({
            SUCCESS: 0,
            PASS_LEN_TOO_SHORT: 1,
            PASS_LEN_EXCEED: 2
        });
    }

    constructor() {
        this.incNumbers = true;
        this.incUpperCase = true;
        this.incLowerCase = true;
        this.incSymbol = false;
        this.incSpecialChar = false;
        this.noRepeatChar = false;
        this.passLen = PasswordGenerator.DEFAULT_PASS_LEN;
        this.expiryNotificaiton = true;
        this.excChar = { 'enable': false, 'char': '' };
    }


    getPool() {
        let charPools = [];
        if (this.incNumbers)
            charPools.push('0123456789');
        if (this.incUpperCase)
            charPools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (this.incLowerCase)
            charPools.push('abcdefghijklmnopqrstuvwxyz');
        if (this.incSymbol)
            charPools.push('@#$%^&*()+-=!_');
        if (this.incSpecialChar)
            charPools.push('~`{}[]|\\\"\':;?/><.,');

        if (this.excChar.enable)
            for (let i = 0; i < charPools.length; i++)
                charPools[i] = charPools[i].replace(
                    new RegExp(`[${this.excChar.char}]`, 'g'), '');

        return charPools;
    }


    generatePassword() {
        let password = '';

        if (this.passLen < PasswordGenerator.DEFAULT_MIN_LEN) {
            return [
                PasswordGenerator.PASS_GEN_STATUS.PASS_LEN_TOO_SHORT,
                password
            ];
        }

        let charPool = this.getPool();
        let charPoolTotalLen = charPool.reduce(function(sum, pool) {
            return sum += pool.length;
        }, 0);

        if (charPoolTotalLen == 0)
            return '';

        if (this.noRepeatChar && charPoolTotalLen < this.passLen) {
            return [
                PasswordGenerator.PASS_GEN_STATUS.PASS_LEN_EXCEED,
                password
            ];
        }

        let usedChar = new Set();
        for (let index = 0; password.length < this.passLen; index++) {
            let pool = charPool[index % charPool.length];
            let rand = Math.floor(Math.random() * pool.length);

            if (!this.noRepeatChar || !usedChar.has(pool[rand])) {
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

        return [
            PasswordGenerator.PASS_GEN_STATUS.SUCCESS,
            password
        ];
    }


    exportOptionInLocal() {
        browser.storage.local.set(this);
    }


    exportClipboardHistoryToLocal(pass) {
        let passList = [];
        if (localStorage.TLPassGeneratorPass !== undefined)
            passList = JSON.parse(localStorage.TLPassGeneratorPass);

        if (passList[passList.length - 1].password === pass)
            passList[passList.length - 1].date = new Date();
        else
            passList.push({
                'date': new Date(),
                'password': pass
            });

        localStorage.setItem('TLPassGeneratorPass', JSON.stringify(passList));
    }


    importClipboardHistoryFromLocal() {
        return (localStorage.TLPassGeneratorPass === undefined) ? [] :
            JSON.parse(localStorage.TLPassGeneratorPass);
    }


    clearClipboardHistory() {
        localStorage.TLPassGeneratorPass = JSON.stringify([]);
    }


    async importOptionFromLocal() {
        Object.assign(this, await browser.storage.local.get(this));
    }


    async exportPasswordHistoryToLocal(expiredDate, domain) {
        let passHistory = { 'password_history': {} };
        passHistory = await browser.storage.local.get(passHistory);

        passHistory['password_history'][domain] = expiredDate;
        browser.storage.local.set(passHistory);
    }


    clearPasswordHistory() {
        browser.storage.local.set({ 'password_history': {} });
    }


    async importPasswordHistoryFromLocal() {
        let passHistory = { 'password_history': {} };
        passHistory = await browser.storage.local.get(passHistory);
        return passHistory['password_history'];
    }


    async getExpiredPassword() {
        let passHistory = await this.importPasswordHistoryFromLocal();
        let res = [];
        let currDateTime = new Date();
        for (const [domain, expiredDate] of Object.entries(passHistory)) {
            if (currDateTime > expiredDate) continue;
            res.push([domain, expiredDate]);
        }

        return res;
    }
}
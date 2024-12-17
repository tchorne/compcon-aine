const TESTSTR = `eyJ2aXNpYmxla2V5IjoiVVVVVVVVVVVVVVVVVVVVVVVVVVUiLCJleHRyYWtleSI6IlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVIiwiYmFzZTY0RGF0YSI6ImV5SnBaQ0k2TWl3aWRIbHdaU0k2SW0xbGMzTmhaMlVpTENKelpXNWtaWElpT2lKYlVFOU1RVkpKVTEwaUxDSnpkV0pxWldOMElqb2lWMlZzWTI5dFpTSXNJbTFsYzNOaFoyVWlPaUpYWld4amIyMWxJSFJ2SUhSb1pTQlFiMnhoY21seklFUmhkR0VnVUdGdVpXd3VJRlJvYVhNZ2FYTWdZU0IzYjNKcklHbHVJSEJ5YjJkeVpYTnpMQ0JoYm1RZ2FYTWdibTkwSUhsbGRDQnlaV0ZrZVNCbWIzSWdkWE5sTGlCUWJHVmhjMlVnWW1VZ2NHRjBhV1Z1ZEN3Z1lXNWtJR05vWldOcklHSmhZMnNnYkdGMFpYSWdabTl5SUhWd1pHRjBaWE11SUZSb1lXNXJJSGx2ZFNCbWIzSWdlVzkxY2lCd1lYUnBaVzVqWlM0aUxDSmhkSFJoWTJodFpXNTBjeUk2SWlJc0lteHZZMkYwYVc5dVRtRnRaU0k2SWlJc0lteHZZMkYwYVc5dVZYSnNJam9pSW4wPSJ9`


class ArgumentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ArgumentError';

        Object.setPrototypeOf(this, ArgumentError.prototype)
    }
}

export class EncodedData {
    visiblekey: string;
    extrakey: string;
    base64Data: string;
    decrypted: boolean;
    realdata: Object;
    id: number;

    public constructor(visiblekey='', extrakey='', realdata=null, base64Data='', decrypted=false, id=0) {
        this.visiblekey = visiblekey;
        this.extrakey = extrakey;
        this.base64Data = base64Data;
        this.realdata = realdata;
        this.decrypted = decrypted;
        this.id = id;
    }

    static copy(data: EncodedData): EncodedData {
        return new EncodedData(
            data.visiblekey,
            data.extrakey,
            data.realdata,
            data.base64Data,
            data.decrypted,
            data.id,
        );
    }
}

function encodeToBase64(str: string): string {
    return Buffer.from(str).toString('base64');
}

function decodeFromBase64(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
}


//#region Viginere
function generateViginereKey(str: string, key: string): string {
    let x = str.length;
    let newKey = "";

    for (let i = 0; i < x; i++) {
        newKey += key[i % key.length]
    }
    return newKey;
}

function encryptViginere(str: string, key: string): string {
    let cipher_text = "";

    str = str.toUpperCase();
    key = key.toUpperCase();

    key = generateViginereKey(str, key);

    for (let i = 0; i < str.length; i++) {
        let x = (str[i].charCodeAt(0) + key[i].charCodeAt(0)) % 26;
        x += 'A'.charCodeAt(0);
        cipher_text += String.fromCharCode(x);
    }

    return cipher_text;
}

function decryptViginere(cipher_text: string, key: string): string {
    let orig_text = "";

    cipher_text = cipher_text.toUpperCase();
    key = key.toUpperCase();

    key = generateViginereKey(cipher_text, key);

    for (let i = 0; i < cipher_text.length; i++) {
        let x = (cipher_text[i].charCodeAt(0) - key[i].charCodeAt(0) + 26) % 26;
        x += 'A'.charCodeAt(0);
        orig_text += String.fromCharCode(x);
    }

    return orig_text;
}

// let teststring = "FLYMETOTHEMOONLETMEPLAYAMONGTHESTARS"
// let key = "TOTHEMOON"
// let encrypted = encryptViginere(teststring, key)
// let decrypted = decryptViginere(encrypted, key)
// console.log(encrypted)
// console.log(decrypted)
//#endregion




export class CommandLine {
    loadedData: EncodedData[];
    decryptAttemptObservers: ((data: EncodedData) => void)[] = [];

    public constructor() {
        this.loadedData = [];
        this.decryptAttemptObservers = [];
    }

    static isBase64(input: string): boolean {
        const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
        if (!base64Regex.test(input) || input.length % 4 !== 0) {
            return false;
        }
        try {
            // Try decoding to validate actual Base64
            const decoded = Buffer.from(input, 'base64').toString('utf-8')
            return true;
        } catch {
            return false;
        }
    }

    private copyOrDecrypt(data: EncodedData): EncodedData {
        if (data.decrypted) return data;
        let valid = (data.visiblekey === "X".repeat(data.visiblekey.length)) && (data.extrakey === "X".repeat(data.extrakey.length))
            
        let newData = new EncodedData();
        newData.visiblekey = data.visiblekey;
        newData.extrakey = data.extrakey;
        newData.base64Data = data.base64Data;
        newData.id = data.id;

        if (valid){
            newData.realdata = this.decrypt(newData.base64Data);
            newData.decrypted = true;
        }
        return newData
    }

    public exportData(data: Object){
        let encodedData = new EncodedData();
        // THIS IS WHERE TO DO THE KEY SHIFTING
        let visiblekey = 'X'.repeat(20);
        let extrakey = 'X'.repeat(80);
        let decryptionKey = "AETHERITE"
        visiblekey = encryptViginere(visiblekey, decryptionKey)
        extrakey = encryptViginere(extrakey, decryptionKey)
        
        encodedData.visiblekey = visiblekey;
        encodedData.extrakey = extrakey;
        //

        let innerJson = encodeToBase64(JSON.stringify(data));
        let json = {
            visiblekey: encodedData.visiblekey,
            extrakey: encodedData.extrakey,
            base64Data: innerJson
        }

        let str = JSON.stringify(json)
        let base64 = encodeToBase64(str);

        console.log("EXPORTED DATA: ", base64)
    }

    private decrypt(inner: string){
        let data = JSON.parse(decodeFromBase64(inner));
        return data;
    }

    public addDataObserver(callback: (data: EncodedData) => void) {
        this.decryptAttemptObservers.push(callback);
    }

    private addDataIfDecryted(data: EncodedData){
        if (data.decrypted){
            this.loadedData.push(data);
        }
    }

    public async parseCommand(command: string): Promise<Object> {
        const parts = command.split(' ');
        const commandName = parts[0];
        const args = parts.slice(1);
        let formattedString = "";
        let resultText = "";
        
        let longResult = false

        const commandMap = {
            'shift': (args: string[]) => this.shift(args),
            'vigi': (args: string[]) => this.viginere(args)
        };

        try{
            if (commandName == 'import'){
                if (args.length != 1){
                    throw new ArgumentError("Invalid Number of Arguments for import")
                }
                // TEST 
                if (args[0] == 'test'){
                    args[0] = TESTSTR;
                }
                //
                let data = await this.importData(args[0]);

                formattedString = "<span class='accent--text'>" + commandName + "</span> " + args[0].slice(0, 15) + "...";

                if (data == null){
                    resultText = "Invalid data";
                }
                else{
                    this.loadedData.push(data);
                    resultText = "success";
                }
            }
            else if (commandMap.hasOwnProperty(commandName)) {
                let data = commandMap[commandName](args);
                
                let numDecrypted = 0

                for (const datapoint of data.resultingData) {
                    for (const observer of this.decryptAttemptObservers) {
                        console.log('CALLING OBSERVER: ', observer)
                        observer(datapoint);
                    }
                    if (datapoint.decrypted) numDecrypted++;
                }

                formattedString = "<span class='accent--text'>" + commandName + "</span> " + args.join(" ");
                resultText = `Function applied. ${numDecrypted} message${numDecrypted==1?"":"s"} decrypted.`;
            }
            else if (commandName == 'help') {
                longResult = true
                formattedString = "<span class='accent--text'>" + commandName + "</span> " + args.join(" ");
                resultText = `Available commands: import, shift, vigi, help 
                <br>import: import data from base64 string
                <br>....usage: import [data]
                <br>shift: shift data by a number of characters (caesar cipher)
                <br>....usage: shift [shiftamount]
                <br>vigi: apply viginere cipher to data
                <br>....usage: vigi [viginerekey]
                <br>help : show this help message
                `;
            }
            else 
            {
                formattedString = "<span class='accent--text'>" + commandName + "</span> " + args.join(" ");
                resultText = "Unknown command: " + commandName;
            }
            
        } catch (e) {
            if (e instanceof ArgumentError) {
                formattedString = "<span class='accent--text'>" + commandName + "</span> " + args.join(" ");
                resultText = `Error parsing command: ${e.message}`;
            } else {
                throw e;
            }
            
        }
        
        if (formattedString.length > 70){
            formattedString = formattedString.slice(0, 70) + "...";
        }
        if (resultText.length > 70 && !longResult){
            resultText = resultText.slice(0, 70) + "...";
        }

        return { commandName, args, resultText, formattedString };
    }

    private async importData(data: string): Promise<EncodedData>{
        console.log('DATA: ', data)

        if (!CommandLine.isBase64(data)) {
            console.error('Invalid base64 string')
            return null
        }
        

        try {
            var json = JSON.parse(decodeFromBase64(data))
            if (!json) {
                return null
            }
        } catch (e) {
            throw new ArgumentError('Unable to decode import.');
        }

        let encodedData = new EncodedData();
        encodedData.visiblekey = json.visiblekey;
        encodedData.extrakey = json.extrakey
        encodedData.base64Data = json.base64Data;
        encodedData.id = Math.floor(Math.random() * 1000000);


        return this.copyOrDecrypt(encodedData);
    }


    private useFunctionOnDataCopy(data: EncodedData, func: (key: string) => string): EncodedData {
        let dataCopy = EncodedData.copy(data);
        
        let modifiedVisibleKey = func(dataCopy.visiblekey)
        let modifiedExtraKey = func(dataCopy.extrakey)

        let newData = new EncodedData();
        newData.visiblekey = modifiedVisibleKey;
        newData.extrakey = modifiedExtraKey;
        newData.base64Data = dataCopy.base64Data;
        newData.id = dataCopy.id;

        return this.copyOrDecrypt(newData);
    }

    private shift(args: string[]) {
        // Step 1. Check arguments
        if (args.length !== 1) {
            throw new ArgumentError('Invalid number of arguments for shift command');
        }
        // Assert the argument is an integer
        const shiftAmount = parseInt(args[0], 10);
        if (isNaN(shiftAmount)) {
            throw new ArgumentError('Invalid shift amount');
        }
        
        // Step 2. Define Helpers

        function shiftChar(c: string){
            let code = c.charCodeAt(0);
            if (code <= 'Z'.charCodeAt(0) && code >= 'A'.charCodeAt(0)){
                code += shiftAmount;
                if (code > 'Z'.charCodeAt(0)){
                    code -= 26;
                }
                if (code < 'A'.charCodeAt(0)){
                    code += 26;
                }
            }
            else if (code <= '9'.charCodeAt(0) && code >= '0'.charCodeAt(0)){
                code += shiftAmount;
                if (code > '9'.charCodeAt(0)){
                    code -= 10;
                }
                if (code < '0'.charCodeAt(0)){
                    code += 10;
                }
            }
            return String.fromCharCode(code);
        }

        function shiftString(s: string){
            s = s.toUpperCase();
            let result = '';
            for (let i = 0; i < s.length; i++){
                result += shiftChar(s[i]);
            }
            return result;
        }

        // Step 3. Apply to Data
        let resultingData: EncodedData[] = [];

        for (const data of this.loadedData) {
            resultingData.push(this.useFunctionOnDataCopy(data, shiftString));
        }
    
        return { resultingData }
    }

    private viginere(args: string[]){
        // Step 1. Check Arguments
        if (args.length !== 1) {
            throw new ArgumentError('Invalid number of arguments for viginere command');
        }
        // Check the key is alphabetic
        if (!/^[a-zA-Z]+$/.test(args[0])) {
            throw new ArgumentError('Viginere key must only contain letters A-Z');
        }

        let key = args[0];
        
        // Step 2. Define helpers

        let decode = (str: string) => {
            return decryptViginere(str, key);
        }

        // Step 3. Apply to Data
        let resultingData: EncodedData[] = [];
        
        for (const data of this.loadedData) {
            resultingData.push(this.useFunctionOnDataCopy(data, decode));
        }

        return { resultingData }
    }
}



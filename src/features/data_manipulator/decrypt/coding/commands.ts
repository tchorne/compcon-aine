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

    public constructor(visiblekey='', extrakey='', realdata=null, base64Data='', decrypted=false) {
        this.visiblekey = visiblekey;
        this.extrakey = extrakey;
        this.base64Data = base64Data;
        this.realdata = realdata;
        this.decrypted = decrypted;
    }

    static copy(data: EncodedData): EncodedData {
        return new EncodedData(
            data.visiblekey,
            data.extrakey,
            data.realdata,
            data.base64Data,
            data.decrypted,
        );
    }
}

function encodeToBase64(str: string): string {
    return Buffer.from(str).toString('base64');
}

function decodeFromBase64(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
}

export class CommandLine {
    loadedData: EncodedData[];

    public constructor() {
        this.loadedData = [];
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

    public async parseCommand(command: string): Promise<Object> {
        const parts = command.split(' ');
        const commandName = parts[0];
        const args = parts.slice(1);
        let formattedString = "";
        let resultText = "";

        try{
            if (commandName == 'import'){
                if (args.length != 1){
                    throw new ArgumentError("Invalid Number of Argumetns")
                }
                let data = await this.importData();
                if (data == null){
                    formattedString = "<span class='accent--text'>" + commandName + "</span> " + args.join(" ");
                    resultText = "Invalid data";
                }
                else{
                    this.loadedData.push(data);
                    formattedString = "<span class='accent--text'>" + commandName + "</span> " + args.join(" ");
                    resultText = "success";
                }
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
        
        return { commandName, args, resultText, formattedString };
    }

    private async importData(): Promise<EncodedData>{
        const data = await navigator.clipboard.readText();
        console.log('DATA: ', data)

        if (!CommandLine.isBase64(data)) {
            console.error('Invalid base64 string')
            return null
        }

        const json = JSON.parse(decodeFromBase64(data))
        if (!json) {
            return null
        }

        let encodedData = new EncodedData();
        encodedData.visiblekey = json.visiblekey;
        encodedData.extrakey = json.extrakey
        encodedData.base64Data = json.base64Data;

        return this.copyOrDecrypt(encodedData);
    }

    private shift(args: string[]) {
        if (args.length !== 1) {
            throw new ArgumentError('Invalid number of arguments for shift command');
        }
        // Assert the argument is an integer
        const shiftAmount = parseInt(args[0], 10);
        if (isNaN(shiftAmount)) {
            throw new ArgumentError('Invalid shift amount');
        }
    
        let resultingData: EncodedData[] = [];
    
        for (const data of this.loadedData) {
            let dataCopy = EncodedData.copy(data);
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
            
            let shiftedVisibleKey = shiftString(dataCopy.visiblekey)
            let shiftedExtraKey = shiftString(dataCopy.extrakey)

            let newData = new EncodedData();
            newData.visiblekey = shiftedVisibleKey;
            newData.extrakey = shiftedExtraKey;
            newData.base64Data = dataCopy.base64Data;

            resultingData.push(this.copyOrDecrypt(newData));
        }
    
        return { resultingData }
    }


}



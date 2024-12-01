class EncodedData {
    visiblekey: string;
    extrakey: string;
    data: Object;

    public constructor(visiblekey='', extrakey='', data=null) {
        this.visiblekey = '';
        this.extrakey = '';
        this.data = null;
    }

    static fromJson(json: any): EncodedData {
        const data = new EncodedData();
        data.visiblekey = json.visiblekey;
        data.extrakey = json.extrakey;
        data.data = json.data;
        return data;
    }

    static toJson(data: EncodedData): any {
        return {
            visiblekey: data.visiblekey,
            extrakey: data.extrakey
        };
    }

    static copy(data: EncodedData): EncodedData {
        return new EncodedData(
            data.visiblekey,
            data.extrakey,
            data.data
        );
    }
}

//#endregion


export class CommandLine {
    loadedData: EncodedData[];

    private async importData(): Promise<Object>{
        const data = await navigator.clipboard.readText();

        if (!CommandLine.isBase64(data)) {
            return null
        }
        const json = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'))
        if (!json) {
            return null
        }
        return json
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


    public parseCommand(command: string): Object {
        const parts = command.split(' ');
        const commandName = parts[0];
        const args = parts.slice(1);

        const commandParsers = {
            'import': (args: string[]) => {
                if (args.length !== 1) {
                    throw new Error('Invalid number of arguments for import command');
                }
            },
            'shift': (args: string[]) => {
                if (args.length !== 1) {
                    throw new Error('Invalid number of arguments for shift command');
                }
                // Assert the argument is an integer
                const shiftAmount = parseInt(args[0], 10);
                if (isNaN(shiftAmount)) {
                    throw new Error('Invalid shift amount');
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

                    let valid = (shiftedVisibleKey === "X".repeat(shiftedVisibleKey.length)) && (shiftedExtraKey === "X".repeat(shiftedExtraKey.length))
                    
                    resultingData.push(new EncodedData(shiftedVisibleKey, shiftedExtraKey, valid?dataCopy.data:null));

                }
            },
            'help': () => {
                return {};
            }
        };
        
        return { commandName, args };
    }
}

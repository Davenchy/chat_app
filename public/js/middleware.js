class Middleware {

    constructor(keyword = '$') {
        this.history = [];
        this.help = {
            isCommand: "check if the text a command or not",
            addCommand: "append new command to the middleware framework",
            parse: "parse and clean the command to run",
            run: "run a command"
        };
        // this.eval = cmd => eval(cmd);
        // this.run = cmd => eval(cmd);
        this.keyword = keyword;
    }

    isCommand(text) { return text.trim().startsWith(this.keyword) }

    addCommand(name, cb = ()=>{}, help = "") {
        if (!name) return false;
        this.commands[name] = cb;
        this.help[name] = help;
        return true;
    }

    parseeval(cmd) {
        if (!this.isCommand(cmd)) return undefined;
        cmd = this.parse(cmd);
        this.run(cmd);
    }

    parse(cmd) {
        if (!this.isCommand(cmd)) return undefined;
        cmd = cmd.trim().substring(1, cmd.length).trim();
        return cmd;
    }

    run(cmd) {
        "use strick";

        let engine = function (x) { return eval(x); }

        return engine(cmd);
    }

}



const gethttpOrigin = () => {
    return window.location.origin
}

class ApiStrGenerate {


    static getCurlString(task_id, options) {
        let data = { task_id: task_id };
        data.title = 'message title';
        data.text = 'Hello World!';
        if (options.html ) {
            data.html = '<h1> Hello World! </h1>';
        }
        if (options.markdown ) {
            data.markdown = '**Hello World!**';
        }
        let dataStr = JSON.stringify(data, null, 4);
        let example = `curl -X POST --location '${gethttpOrigin()}/api/v1/message/send' \\
        --header 'Content-Type: application/json' \\
        --data '${dataStr}'`;
        return example;
    }

}

export { ApiStrGenerate };

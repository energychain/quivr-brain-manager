const axios = require("axios");

module.exports = function(config) {
    if((typeof config == 'undefined')||(config == null)){
        throw new Error("Missing config. Specify at leas {config.quivr_api_key='YOUR_API_KEY'}");
    }

    if(typeof config.quivr_url == 'undefined' ) {
        config.quivr_url = 'https://api.quivr.app';
    }
    if(typeof config.quivr_api_key == 'undefined') {
        throw new Error("Missing quivr_api_key");
    }

    const crawl = async function(brainId,url,settings){
        const defaults = {
            "url": url,
            "js": false,
            "depth": 1,
            "max_pages": 100,
            "max_time": 60
        }

        if((typeof settings == "undefined") || (settings == null)){
            settings = defaults;
            settings.url = url;
        }
        
        const _brains = await brains();
        let selectedBrain = null; 
        for(let i=0;i<_brains.brains.length;i++) {
            if(_brains.brains[i].id == brainId) {
                selectedBrain = _brains.brains[i];
            }
            if(_brains.brains[i].name == brainId) {
                selectedBrain = _brains.brains[i];
            }
        }
        if(selectedBrain == null){
            throw new Error("Brain not found");
        }

        const chat = await createChat(selectedBrain.name+"_crawl_"+new Date().getTime());
        if(typeof chat.chat_id == "undefined"){
            throw new Error("Chat not created for crawling");
        }

        let res = await axios.post(
            "https://brain.tydids.com/crawl?brain_id="+selectedBrain.id+"&chat_id="+chat.chat_id,settings,{
                headers:{
                    'Authorization': 'Bearer '+config.quivr_api_key
                }
        });
        await removeChat(chat.chat_id);
        return res.data;
    }

    /**
     * Removes a chat by its ID.
     *
     * @param {string} chatId - The ID of the chat to be removed.
     * @return {Promise} - A promise that resolves to the data returned by the server.
     */
    const removeChat = async function(chatId){
        const res = await axios.delete(config.quivr_url + '/chat/'+chatId,{
            headers:{
                'Authorization': 'Bearer '+config.quivr_api_key
            }
        });
        return res.data;
    }

    /**
         * Retrieves the brains from the quivr_url endpoint.
         *
         * @return {Promise<Object>} The brains data.
    */
    const brains = async function(){
        const res = await axios.get(config.quivr_url + '/brains/',{
            headers:{
                'Authorization': 'Bearer '+config.quivr_api_key
            }
        });
        return res.data;
    }

    /**
     * Creates a chat with the given name.
     *
     * @param {string} name - The name of the chat.
     * @return {Promise} A promise that resolves to the chat data.
     */
    const createChat = async function(name) {
        const res = await axios.post(config.quivr_url + '/chat',{
            "name":name
        },{
            headers:{
                'Authorization': 'Bearer '+config.quivr_api_key
            }
        });
        return res.data;
    }

    /**
     * Retrieves the chat history for a given chat ID.
     *
     * @param {string} chat_id - The ID of the chat.
     * @return {Promise<object>} The chat history data.
     */
    const chatHistory = async function(chat_id) {
        const res = await axios.get(config.quivr_url + '/chat/'+chat_id+'/history',{
            headers:{
                'Authorization': 'Bearer '+config.quivr_api_key
            }
        });
        return res.data;
    }
    const askQuestion = async function(brain_id,chat_id,question,tenperature,max_tokens,model) {
        if((typeof tenperature == 'undefined') || (tenperature == null)) tenperature = 0;
        if((typeof max_tokens == 'undefined') || (max_tokens == null)) max_tokens = 750;
        if((typeof model == 'undefined') || (model == null)) model = 750;

        const res = await axios.post(
            config.quivr_url+"/chat/"+chat_id+"/question?brain_id="+brain_id,{
                "question":question,
                "model": model,
                "temperature": tenperature,
                "max_tokens": max_tokens,
                "brain_id": brain_id
            },{
                headers:{
                    'Authorization': 'Bearer '+config.quivr_api_key
                }
        });
        return res;
    }
    const createBrain = async function(name) {
        const res = await axios.post(config.quivr_url + '/brains/',{
            "name":name
        },{
            headers:{
                'Authorization': 'Bearer '+config.quivr_api_key
            }
        });
        return res.data;
    }
    
    return {
        brains: brains,
        createChat: createChat,
        createBrain: createBrain,
        crawl: crawl,
        removeChat:removeChat,
        chatHistory:chatHistory,
        askQuestion:askQuestion,
        dumpConfig: function(){
            return config;
        }
    }
}

self.onmessage = function(event){
    const {type,data} = event.data;
    if(type === 'CALCULATE'){
        console.log("Worker: received", data);
        const result = data
            .filter((item)=> item.price<1000)
            .sort((a,b)=> a.price - b.price);

      self.postMessage({type:"RESULT",result});
    }
}
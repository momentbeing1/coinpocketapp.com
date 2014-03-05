(function(Models) {

  function BitcoinWorker() {
    var self = this;

    self.currentMessageId = 0;
    self.callbacks = {};

    self.worker = new Worker('/js/workers/bitcoin_worker.js');
    self.worker.postMessage();
    self.worker.onmessage = function(e) {
      var message = e.data;
      self.callbacks[message.id].apply(null, [message.result]);
      delete self.callbacks[message.id];
    };
  }

  BitcoinWorker.prototype.async = function(functionName, params, hollaback) {
    var message = {
      id: this.currentMessageId,
      functionName: functionName,
      params: params,
    };

    this.callbacks[message.id] = hollaback;
    this.worker.postMessage(message);
    this.currentMessageId++;
  };

  Models.bitcoinWorker = new BitcoinWorker();

})(CoinPocketApp.Models);

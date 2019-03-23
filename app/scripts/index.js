const request = require("request");

class Api {
  constructor(url, presenter) {
    this.url = url;
    this.presenter = presenter;
    this.lock = false;
   }

  get(method, args) {
    this.raw(method, args, (body, err) => {
      if (!err) {
        this.presenter.present(body);
      }
    });
  }

  raw(method, args, listener) {
    if (this.lock) {
      console.log("api locked");
      return;
    } 
    let url = this.url + "/" + method;
    for (let i = 0; i < args.length; i++) {
      url += `/${args[i]}`;
    }
    this.lock = true;
    request(url,{json: true} ,(err, res, body) => {
      this.lock = false;
      listener(body, err);
    });
  }

  post(method, args) {
    let url = this.url + "/" + method;
    request.post({url: url, form: args }, function(err,res,body){ 
      console.log(err, body);
    });
  }
}

class Presenter {
  constructor() {
    this.id = 1;
    this.last = 1;
  }

  present(quote) {
    if (!quote) return;
    if (Array.isArray(quote)) {
      for (let i = 0; i < quote.length; i++) {
        this.present(quote[i]);
      }
    } else {
      document.getElementsByClassName("quote-id")[0].innerHTML = `#${quote["id"]}`;
      document.getElementsByClassName("quote-adder")[0].innerHTML = quote["adder"];
      document.getElementsByClassName("quote-author")[0].innerHTML = quote["author"];
      document.getElementsByClassName("quote-text")[0].innerHTML = quote["quote"];

      let edit = document.getElementsByClassName("quote-edit")[0];
      if (quote["edited_at"] > 0) {
        edit.classList.remove("non");
        edit.innerHTML = quote["edited_by"];
      } else {
        edit.classList.add("non");
      }

      this.id = quote["id"];
    }
  }
}

let presenter = new Presenter()
let api = new Api("http://52.48.142.75:6741/api/quote", presenter);

api.raw("all", [], (body, err) => {
  if (!err) {
    presenter.last = body.length;
    clickJump(0);
  }
});
document.addEventListener('DOMContentLoaded', function(){
	if (process.platform != "darwin") {
  	console.log("removing mac class");
  
  	//let collection = document.getElementsByClassName("mac")[0];
  	//collection.classList.remove("mac");
		document.getElementsByClassName("mac")[0].classList.remove("mac");
	}
});

function clickRandom() {
  api.get("random", []);
}

function clickJump(dir) {
  if (presenter.id + dir > 0 && presenter.id + dir <= presenter.last) {
    api.get("pos", [`${presenter.id + dir}`]);
  }
}

function clickAdd() {
  
}

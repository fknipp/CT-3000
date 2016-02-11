import canto34 from 'canto34/src/canto34';
import Promise from 'promise';

export default class {

  constructor(objects){
    this.lexer = new canto34.Lexer();
    this.parser = new canto34.Parser();

    this.setupTokens();
  }

  parse(text){
    let tokens;
    try{
      tokens = this.lexer.tokenize(text);
    }catch(e){
      return new Promise.reject();
    }
    if(tokens){
      this.parser.initialize(tokens);
      return this.runParser();
    }
  }

  setupTokens(){
    let types = canto34.StandardTokenTypes;

    this.lexer.addTokenType(types.whitespace('ws'));
    this.lexer.addTokenType(types.constant('als','if'));
    this.lexer.addTokenType(types.constant('dan','then'));
    this.lexer.addTokenType(types.constant('=','equals'));
    this.lexer.addTokenType(types.constant('en','and'));
    this.lexer.addTokenType({ name: 'item', regexp: /^[a-z0-9]+/i });
    this.lexer.addTokenType({ name: 'string', regexp: /^\"[^\"]*\"+/i });
  }

  runParser(){
    return new Promise((resolve, reject) => {
      this.match('if').then(result => {
        this.readIfThen()
          .then(result => {
            this.readEOF().then(() => resolve(result), err => reject());
          })
          .catch(err => reject());
      }, err => {
        this.readAssignments()
          .then(result => {
            this.readEOF().then(() => resolve({
              type: 'statement',
              assignments: result
            }), err => reject());
          })
          .catch(err => reject());
      });
    });
  }

  readEOF(){
    return new Promise((resolve, reject) => {
      if(this.parser.eof())
        resolve();

      reject();
    });
  }

  readIfThen(){
    let checks = [];

    return new Promise((resolve, reject) => {
      this.readAssignments()
        .then(result => {
          checks = result;
          this.match('then')
            .then(() => {
              this.readAssignments()
                .then(result => resolve(this.readIfThenReturn(checks, result)))
                .catch(err => resolve(this.readIfThenReturn(checks, null)));
            })
            .catch(err => resolve(this.readIfThenReturn(checks, null)));
        })
        .catch(err => resolve(this.readIfThenReturn(null, null)));
    });
  }

  readIfThenReturn(checks, assignments){
    return {
      type: 'if',
      checks: checks,
      assignments: assignments
    };
  }

  readAssignments(assignments = []){
    return new Promise((resolve, reject) => {
      this.readAssignment()
        .then(result => {
          if(!result || result.length === 0)
            reject();

          let [object, , value] = result;
          assignments.push({
            object: object,
            value: value
          });

          return this.match('and');
        }).then(result => {
          this.readAssignments(assignments)
            .then(result => resolve(result))
            .catch(err => reject());
        }).catch(err => resolve(assignments));
    });
  }

  readAssignment(){
    return new Promise((resolve, reject) => {
      this.match('item', []).then(result => {
        return this.match('equals', result);
      }, err => resolve(err)).then(result => {
        return this.readItemOrString(result);
      }, err => resolve(err))
        .then(result => resolve(result), err => resolve(err));
    });
  }

  readItemOrString(list){
    return new Promise((resolve, reject) => {
      this.match('item', list)
        .then(result => resolve(result))
        .catch(err => {
          this.match('string', list)
            .then(result => resolve(result))
            .catch(err => reject(list));
        });
    });
  }

  match(type, list){
    return new Promise((resolve, reject) => {
      try{
        let val = this.parser.match(type).content;


        if(list && list.constructor === Array){
          list.push(val);
          resolve(list);
        }else{
          resolve(val);
        }
      }catch(e){
        reject(list);
      }
    });
  }

}

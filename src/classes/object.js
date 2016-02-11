export default class {

  constructor(data){
    if(Object.keys(data).length === 0)
      return;

    this.name = data.name;

    switch(data.type){
      case 'string':
        this.type = 'string';
        this.state = '';

        if(data.values && data.values.constructor === Array){
          this.values = data.values;

          if(data.default && typeof data.default === 'string' && this.values.indexOf(data.default) > -1){
            this.state = data.default;
          }else if(this.values.length > 0){
            this.state = this.values[0];
          }
        }else{
          if(data.default && typeof data.default === 'string'){
            this.state = data.default;
          }
        }

        break;
      case 'int':
        this.type = 'int';
        this.state = 0;

        if(data.values && data.values.constructor === Array){
          this.values = data.values;

          if(data.default && typeof data.default === 'number' && data.default % 1  === 0 && this.values.indexOf(data.default) > -1){
            this.state = data.default;
          }else if(this.values.length > 0){
            this.state = this.values[0];
          }
        }else{
          if(data.default && typeof data.default === 'number' && data.default % 1  === 0){
            this.state = data.default;
          }
        }

        break;
      /*
      default:
        this.type = 'bool';
        this.state = false;
        this.values = [true, false];

        if(data.default && typeof data.default === 'boolean' && this.values.indexOf(data.default) > -1){
          this.state = data.default;
        }
      */
    }

  }

  getValue(){
    return this.state;
  }

  getPossibleValues(){
    return this.values ? this.values.sort() : [];
  }

  setValue(value){
    if((value || this.type == 'string') && ((!this.values && this.valueMatchesType(value)) || this.values.indexOf(value) > -1)){
      this.state = value;
      return true;
    }
    return false;
  }

  valueMatchesType(value){
    switch(this.type){
      case 'string':
        return true;
      case 'int':
        return /^[0-9]+$/.test(value);
    }
  }

}
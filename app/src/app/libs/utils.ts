export class Utils{

  constructor(){}


  // CREAR TOKEN PARA API
  public static convert(token: string, time: number) {
    let new_token = '';
    let number = '';
    for (let i = 0; i < token.length; i++) {
      new_token += token[i].charCodeAt(0);
    }
    number = (parseInt(new_token) + time).toString();
    new_token = '';
    for (let i = 0; i < number.length; i++) {
      if (i % 2 === 0) new_token += String.fromCharCode(65 + parseInt(number[i]));
      else new_token += number[i].toString();
    }
    return {
      token: new_token,
      time: time
    };
  }
  
  
  public static generateSlug(string: string) {
    const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
    const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with ‘and’
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple — with single -
      .replace(/^-+/, '') // Trim — from start of text .replace(/-+$/, '') // Trim — from end of text
  }
  
  public static isBase64(str: string) {
    return (str.search('base64') != -1);
  }



}

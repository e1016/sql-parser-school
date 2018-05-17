window.extractText = function (str) {
	return document.querySelector('#input').value
}


window.createGrammarTable = function (cont) {
  /*
    Preparar el textbox para el analisis
  */

  //Separar por renglones
  let renglones = new Array();
  let ren = new Array();
  let resultados = new Array();
  // Se prepapra el texto para ser separado por saltos de línea
  cont = cont.split(/(\r\n|\n|\r)/gm); //Separa el texto por saltos de linea

  //Generar renglones
  for(let i = 0; i<cont.length; i++){
    if (!cont[i].match(/(\r\n|\n|\r)/gm)){ //FILTRA PARA ELIMINAR LOS SALTOS BASURA
      // renglones.push(cont[i].split(/\s/gm));
      renglones.push(cont[i]);
    }
  }

  for(let i = 0; i<renglones.length; i++){
    if(renglones[i].replace(/\s/g,'')!=''){ //Limpiar los renglones vacios
      //Conseguir SQL_strings
      let temp = renglones[i].split(/(\')/);//Separar por comillas
      for(let j = 0; j<temp.length; j++){
        if(temp[j].replace(/\s/g,'')!=''){//Evita ingresar partes vacias al nuevo arreglo
          if(temp[j]=="'"){ //Si se encuentra un string de apertura
            if(temp[j+2]=="'"){ //Comprobar si hay cerradura en el mismo renglon
              ren.push(["'"+temp[j+1]+"'", i+1, 62]);
              j+=2;
            }else{
              return {error: true, code: '205', linea: i+1};
            }
          }else{
            ren.push([temp[j], i+1]);
          }
        }
      }
    }
  }

    //Filtra para limpiar los espacios
    for(let i = 0; i<ren.length; i++){
      if(!ren[i][2]){
        let aux = ren[i][0].split(/\s/g);
        for(let j = 0; j<aux.length; j++){
          if(aux[j]!='')
            resultados.push([aux[j], ren[i][1]])
        }
      }else{
        resultados.push(ren[i])
      }
    }


  //Separar elementos.
  let tablita  = new Array();

  //Resultados obtiene el valor de resultados
  resultados.forEach( (n, i) =>{
    //Si esta dentro del lexema
    if(n[2]){
      tablita.push([n[0], n[1], n[2], 'a']);
    }else if(sintacticTable[n[0].toLowerCase()]){
      tablita.push([ n[0], n[1], sintacticTable[n[0].toLowerCase()].valor, sintacticTable[n[0].toLowerCase()].simbolo ]);
    } else{
      let simbolo = /<|>|\+|\-|\*|\/|\,|\(|\)|\=|\;/g;
      let aux = '';
      let reservado = false;
      for(let i = 0; i<n[0].length; i++){
        if(n[0][i].match(simbolo)){
          if(reservado){
            tablita.push([aux, n[1]]);
            aux = '';
          }
          aux += n[0][i]
          if((aux == '<' || aux == '>') && n[0][i+1]=='='){
            aux += n[0][i+1];
            i++;
          }
          tablita.push([aux, n[1]]);
          aux = '';
          reservado = false;
        }else{
          reservado = true;
          aux+=n[0][i];
        }
      }
      if(aux!=''){
        tablita.push([aux, n[1]]);
      }
    }
  });

  //Rellenar faltantes
  for(let i = 0; i<tablita.length; i++){
    if(!tablita[i][2]){
        if(sintacticTable[tablita[i][0]]){
          tablita[i].push(sintacticTable[tablita[i][0]].valor ,sintacticTable[tablita[i][0]].simbolo);
        } else if(tablita[i][0].match(/^-?\d+\.?\d*$/)){
          tablita[i].push(61, 'd');
        }else{
          tablita[i].push(62, 'a');
        }
    }
  }
  return tablita;
}

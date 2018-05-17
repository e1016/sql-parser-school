
//Variables
var flask;
var sintacticTable;
var tablaLexica;
var $tablaLexica_btn;
var $tableContainer;
var $runBtn;
var error_codes;
var DML;
var DDL;

//String prototype, para generar foreach
String.prototype.forEach = function (call) {
	var a = this.split('');
	a.forEach(e => { call(e) })
}

//Tabla sintactia
sintacticTable = {
	//LEXEMAS
	'select': {
		'simbolo': 's',
		'valor': 10
	},
	'from':{
		'simbolo': 'f',
		'valor': 11
	},
	'where':{
		'simbolo': 'w',
		'valor': 12
	},
	'in':{
		'simbolo': 'n',
		'valor': 13
	},
	'and':{
		'simbolo': 'y',
		'valor': 14
	},
	'or':{
		'simbolo': 'o',
		'valor': 15
	},
	'create':{
		'simbolo': 'c',
		'valor': 16
	},
	'table':{
		'simbolo': 't',
		'valor': 17
	},
	'char':{
		'simbolo': 'h',
		'valor': 18
	},
	'numeric':{
		'simbolo': 'u',
		'valor': 19
	},
	'not':{
		'simbolo': 'e',
		'valor': 20
	},
	'null':{
		'simbolo': 'g',
		'valor': 21
	},
	'constraint':{
		'simbolo': 'b',
		'valor': 22
	},
	'key':{
		'simbolo': 'k',
		'valor': 23
	},
	'primary':{
		'simbolo': 'p',
		'valor': 24
	},
	'foreign':{
		'simbolo': 'j',
		'valor': 25
	},
	'references':{
		'simbolo': 'l',
		'valor': 26
	},
	'insert':{
		'simbolo': 'm',
		'valor': 27
	},
	'into':{
		'simbolo': 'q',
		'valor': 28
	},
	'values':{
		'simbolo': 'v',
		'valor': 29
	},
	//Delimitadores
	',':{
		'simbolo' : ',',
		'valor' : 50
	},
	'.':{
		'simbolo' : '.',
		'valor' :  51
	},
	'(':{
		'simbolo' : '(',
		'valor' :  52
	},
	')':{
		'simbolo' : ')',
		'valor' :  53
	},
	'\"':{
		'simbolo' : '\"',
		'valor' :  54
	},
	';':{
		'simbolo' : ';',
		'valor' : 55
	},
	'+':{
		'simbolo': '+',
		'valor':70
	},
	'-':{
		'simbolo':'-',
		'valor':71
	},
	'*':{
		'simbolo':'*',
		'valor':72
	},
	'/':{
		'simbolo':'/',
		'valor':73
	},
	//Relacionales
	'>':{
		'simbolo':'>',
		'valor':81
	},
	'<':{
		'simbolo':'<',
		'valor':82
	},
	'=':{
		'simbolo':'=',
		'valor':83
	},
	'>=':{
		'simbolo':'>=',
		'valor':84
	},
	'<=':{
		'simbolo':'<=',
		'valor':85
	}
}

DML = {
	'select': {
		'links':['*', 'atrib1'],
		'match': function(x){
			return x.match( /^(SELECT)$/i);
		},
		'state': false,
		'err': function(){
			return 204;
		}
	},
	'*': {
		'links': ['from'],
		'match': function(x){
			return x.match( /^(\*)$/i);
		},
		'state': false,
		'err': function(){
			return 201;
		}
	},
	'atrib1': {
		'links': [',1', 'from'],
		'match': function(x){
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match( /^([A-Z])+([\w|\#])*(\.[A-Z])*([\w|\#])*$/gi);
			}
		},
		'state': false,
		'err': function(){
			return [201, 205];
		}
	},
	',1': {
		'links': ['atrib1'],
		'match': function(x){
			return x == ',';
		},
		'state': false,
		'err': function(){
			return 204;
		}
	},
	'from': {
		'links': ['tabla'],
		'match': function(x){
			return x.match( /^(FROM)$/i);
		},
		'state': false,
		'err': function(){
			return 204;
		}
	},
	'tabla': {
		'links': [',2', 'where', ')', ';'],
		'match': function(x){
			if(sintacticTable[x.toLowerCase()]){
				return false;
			}else{
				return x.match( /^([A-Z])+([\w|\#|\d])*$/gi);
			}
		},
		'state': false,
		'err': function(){
			return [205, 201];
		}
	},
	',2': {
		'links': ['tabla'],
		'match': function(x){
			return x == ',';
		},
		'state': false,
		'err': function(){
			return 204;
		}
	},
	'where': {
		'links': ['num1', 'txt1', 'identi1'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			} else {
				return x.match( /^(WHERE)$/i);
			}
		},
		'state': false,
		'err': function(){
			return [204, 206];
		}
	},
	'num1': {
		'links': ['in', 'relacional'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match(/^[+-]?\d+(\.\d+)?$/);
			}
		},
		'state': false,
		'err': function(){
			return [201, 208];
		}
	},
	'txt1': {
		'links': ['in', 'relacional'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match(/^'([^'])*'$/i);
			}
		},
		'state': false,
		'err': function (){
			return [201, 208]
		}
	},
	'identi1': {
		'links': ['in', 'relacional'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match(/^([A-Z])+([\w|\d|\#])*(\.[A-Z]+[\w|\d|\#]+)?$/i);
			}
		},
		'state': false,
		'err': function(){
			return [201, 208];
		}
	},
	'relacional': {
		'links': ['txt2', 'identi2', 'num2'],
		'match': function (x) {
			return x.match(/^(<=|>=|=|<|>)$/);
		},
		'state':false,
		'err': function(){
			return [204, 206];
		}
	},
	'num2': {
		'links': ['and', ')', ';'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match(/^[+-]?\d+(\.\d+)?$/);
			}
		},
		'state': false,
		'err': function(){
			return [201, 205];
		}
	},
	'txt2': {
		'links': ['and', ')', ';'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match(/^'([^'])*'$/i);
			}
		},
		'state': false,
		'err': function(){
			return [201, 205];
		}
	},
	'identi2': {
		'links': ['and', ')', ';'],
		'match': function (x) {
			if(sintacticTable[x]){
				return false;
			}else{
				return x.match(/^([A-Z])+([\w|\d|\#])*(\.[A-Z]+[\w|\d|\#]+)?$/i);
			}
		},
		'state': false,
		'err': function(){
			return [201, 205];
		}
	},
	')': {
		'links':[')', 'and', ';'],
		'match': function(x){
			return x==')'
		},
		'state': false,
		'err': function(){
			return [205, 201];
		}
	},
	'and': {
		'links':['identi1', 'num1', 'txt1'],
		'match': function(x){
			return x.match( /^(AND)$/i);
		},
		'state':false,
		'err': function(){
			return [204, 206];
		}
	},
	'in': {
		'links': ['('],
		'match': function(x){
			return x.match( /^(IN)$/i);
		},
		'state': false,
		'err': function(){
			return 205;
		}
	},
	'(': {
		'links':['select'],
		'match': function (x) {
			return x=='(';
		},
		'state': false,
		'err': function(){
			return 201;
		}
	},
	';': {
		'state': true,
		'match': function(x){
			return x == ';';
		}
	}
}

window.checkSintax = function(sentencias) {
	let lim = 0;
	for(let i = 0; i < sentencias.length; i++){
		if(sentencias[i][0]==';'){
			if(checkStatement(sentencias.slice(lim, i + 1))){
				lim = i+1;
			}else{
				return false;
			}
		}
	}
	if (lim < sentencias.length) {
		vm.status = 2;
		return false;
	} else {
		vm.status = 0;
		return true;
	}
}

// + - - - - - - - + - +
// + - - - - - - - + - +
// +  Grammar      | | |
// + - - - - - - - + - +
// + - - - - - - - + - +

window.checkStatement = function(statement) {
	let pila = new Array,
	arbol = []

	if(statement[0][0].toLowerCase() === 'select'){
		arbol = DML
		apun = 'select'
	}else{
		vm.status = 2;
		return false
	}
	for (let i = 1; i < statement.length; i++) {
		if (statement[i][0] === '(') {
			pila.push('(')
		} else if (statement[i][0]==')') {
			pila.pop()
		}
		if(!stMatch(statement[i], arbol, apun, this)){
			return false;
		}
	}
	if(pila.length==0){
		return true
	}else{
		vm.status = 2;
		return false;
	}
}

window.stMatch = function(st, ar, ap, ctx){ //statement, arbol, apuntador, contexto
	for(let j = 0; j<ar[ap].links.length; j++){
		let s = ar[ap].links[j];
		if(ar[s].match(st[0])){
			ctx.apun = s;
			return true;
		}
	}
	vm.status = 2;
	return false;
}


const Grammr = {
	Check (statement, step) {
		switch (step) {
			case 0:
			return statement === 'SELECT'
			break;
			case 0:
			return statement === 'SELECT'
			break;
			default:

		}
	},
	Validate (SQL) {
		this.count = 0
		ths.SQL = SQL.split(/ +/g)

		this.SQL.forEach(statement => {
			if (this.Check(statement, this.count)) {
				this.count++
			} else {
				c('Fatal error')
			}
		})
	}
}

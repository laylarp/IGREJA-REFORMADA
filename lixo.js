var dadosInuteis1 = "asdhjf872364kjhasdf983745kjhasdf" + Math.random() * 10000;
var arrayConfuso = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

function funcaoSemSentidoA(parametro) {
    var resultadoTemporario = "";
    for (var indice = 0; indice < parametro.length; indice++) {
        resultadoTemporario += parametro.charCodeAt(indice) * Math.PI + "-";
    }
    return resultadoTemporario.substring(0, resultadoTemporario.length - 1);
}

var objetoInutil = {
    propriedade1: "valor1",
    propriedade2: 98765.4321,
    propriedade3: [11, 22, 33, 44, 55],
    propriedade4: { 
        subprop1: "texto aleatório",
        subprop2: function() { return Math.random(); }
    },
    propriedade5: new Date().getTime()
};

var xyz123 = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod";
var abc789 = 87654 * 4321 / 1234 + 5678;
var def456 = ["x", "y", "z", "a", "b", "c", "d", "e"];

var textoHebraicoMisturado = "זה קוד מקרי לחלוטין ללא משמעות";
var codigoOculto1 = "password:hidden_in_plain_sight";
var codigoOculto2 = "senha:perdida_nos_codigos";
var codigoOculto3 = "chave:esquecida_para_sempre";

var adminPassword = "irm3022irm";

function outraFuncaoInutil(valor) {
    var acumulador = 0;
    for (var i = 0; i < valor; i++) {
        acumulador += Math.pow(i, 2);
    }
    return acumulador;
}

var dadosExtras1 = "fim da primeira parte " + new Date().toISOString();
var dadosExtras2 = 999888777666555444333222111;
var dadosExtras3 = ["final", "arquivo", "terminado", "concluido"];

function funcaoNuncaUsada() {
    console.log("Esta função nunca será executada");
    return "resultado inútil";
}

var terminoDoArquivo = funcaoSemSentidoA("fim") + " " + outraFuncaoInutil(5);
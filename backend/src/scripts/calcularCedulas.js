// Script temporal para calcular dígitos verificadores

function generarDigitoVerificador(cedula9) {
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = parseInt(cedula9[i], 10) * coeficientes[i];
    if (valor > 9) {
      valor -= 9;
    }
    suma += valor;
  }

  const decenaSuperior = Math.ceil(suma / 10) * 10;
  let digitoVerificador = decenaSuperior - suma;
  
  if (digitoVerificador === 10) {
    digitoVerificador = 0;
  }

  return digitoVerificador;
}

console.log('=== CREDENCIALES DE USUARIOS ===\n');
console.log('CONTRASEÑA PARA TODOS: 123456\n');

console.log('--- GUAYAS (09) ---');
console.log('Cédula: 090123456' + generarDigitoVerificador('090123456') + ' | Usuario: Fernando Castro');
console.log('Cédula: 090234567' + generarDigitoVerificador('090234567') + ' | Usuario: Patricia Rivera');
console.log('Cédula: 090345678' + generarDigitoVerificador('090345678') + ' | Usuario: Andrés Jiménez');

console.log('\n--- AZUAY (01) ---');
console.log('Cédula: 010123456' + generarDigitoVerificador('010123456') + ' | Usuario: Eduardo Vargas');
console.log('Cédula: 010234567' + generarDigitoVerificador('010234567') + ' | Usuario: Gabriela Moreno');
console.log('Cédula: 010345678' + generarDigitoVerificador('010345678') + ' | Usuario: Mauricio Rojas');

console.log('\n--- CHIMBORAZO (06) ---');
console.log('Cédula: 060123456' + generarDigitoVerificador('060123456') + ' | Usuario: Marco Benavides');
console.log('Cédula: 060234567' + generarDigitoVerificador('060234567') + ' | Usuario: Rosa Cárdenas');
console.log('Cédula: 060345678' + generarDigitoVerificador('060345678') + ' | Usuario: Jorge Espinoza');


const { exec } = require('child_process');

// Libérer le port 3001 puis lancer le backend
exec('npx kill-port 3001', (err, stdout, stderr) => {
  if (err) {
    console.error('Erreur lors de la libération du port 3001:', stderr);
  } else {
    console.log(stdout);
    // Lancer le backend
    const server = exec('node server.js');
    server.stdout.on('data', data => process.stdout.write(data));
    server.stderr.on('data', data => process.stderr.write(data));
    server.on('close', code => {
      console.log(`Le backend s'est arrêté avec le code ${code}`);
    });
  }
});

 
 
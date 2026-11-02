const { exec } = require('child_process');
exec('find C:/Users/joyud/Desktop/Projects/portfolio -name "*.ts" | grep -i resume', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(stdout);
});
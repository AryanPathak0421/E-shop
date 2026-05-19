const fs = require('fs');
const path = require('path');

const dirs = [
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\models',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\routes',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\controllers',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\middleware',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\services',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\config',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\src\\utils',
  'd:\\Practice-Projects\\Roam_MyWay\\backend\\uploads',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\components\\common',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\components\\customer',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\components\\admin',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\components\\shared',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\pages\\customer',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\pages\\admin',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\pages\\auth',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\redux',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\services',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\hooks',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\src\\utils',
  'd:\\Practice-Projects\\Roam_MyWay\\frontend\\public'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created: ${dir}`);
  }
});

console.log('All directories created successfully!');

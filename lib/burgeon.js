'use strict';

const shell = require('shelljs'),
    fs = require('fs-extra'),
    desc = require('../doc/npmDesc'),
    path = require('path');


class burgeon {

    constructor() {
        this.path = path.join(process.env.HOME || '/', '.burgeon/');
        this.defaultPath = path.join(this.path, 'default/');
        this.lastlySshPath = path.join(this.path, 'lastly/');
        this.sshPath = path.join(process.env.HOME || '/', '.ssh/');
        this.regExpSsh = 'id_rsa*';
        this.id_rsa = 'id_rsa';
        this.id_rsa_pub = 'id_rsa.pub';

        fs.ensureDirSync(this.defaultPath);
        fs.ensureDirSync(this.lastlySshPath);
        fs.ensureDirSync(this.sshPath);
    }

    /**
     * 查看使用中的密钥
     */
    catPublicSsh() {
        try {
            console.log('😊：这是您的ssh公钥(复制以下内容到对应到需要的地方即可)......\n');
            shell.exec(`cat ${path.join(this.sshPath, this.id_rsa_pub)}`)
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！` + e)
        }
    };

    /**
     * 查看备份的密钥
     */
    catBkPublicSsh() {
        try {
            console.log('😊：这是您备份ssh公钥(要使用请先恢复)......\n');
            shell.exec(`cat ${path.join(this.defaultPath, this.id_rsa_pub)}`)
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！` + e)
        }
    };

    /**
     * 备份正在使用的密钥
     */
    bkSsh() {
        try {
            console.log(`⚠️： 您已经生成过ssh密钥,帮您备份到${path.join(this.path, 'default/')}下......\n`);
            if (fs.existsSync(path.join(this.sshPath, this.id_rsa_pub))) {
                shell.rm('-rf', this.defaultPath + this.regExpSsh);
                shell.cp('-Rf', this.sshPath + this.regExpSsh, this.defaultPath);
                console.log(`😊： 备份已完成！`)
            } else {
                console.log(`😧: 您没有使用中的ssh-key，赶快生成一个吧!`)
            }
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }

    /**
     * 恢复备份的密钥
     */
    recoverSsh() {
        try {
            console.log(`⌛： 帮您恢复密钥，请稍后......\n`);
            if (fs.existsSync(path.join(this.defaultPath, this.id_rsa_pub))) {
                shell.rm('-rf', this.sshPath + this.regExpSsh);
                shell.cp('-n', this.defaultPath + this.regExpSsh, this.sshPath);
                console.log(`😊： 恢复已完成！`)
            } else {
                console.log(`😧: 您没有备份过ssh-key，重要密钥要记得备份哦!`)
            }
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    };

    /**
     * 创建一个新密钥，并使用
     * @param email
     */
    createSsh(email) {
        try {
            console.log('⌛️：帮您生成ssh文件......\n');

            shell.rm('-rf', this.lastlySshPath + this.regExpSsh);
            shell.cd(this.lastlySshPath);
            shell.exec(`ssh-keygen -t rsa -b 4096 -C "${email}" -f "id_rsa"`);
            shell.cp('-Rf', this.lastlySshPath + this.regExpSsh, this.sshPath);

            console.log('😊：ssh已生成成功!\n')
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }

    install(name, url) {
        try {
            console.log(`⌛️：帮您安装${name}文件......\n`);
            shell.cd(this.path);
            let npmDir = path.join(this.path, name);
            fs.removeSync(npmDir);
            shell.exec(`git clone ${url} && cd ${name} && npm install && npm ln`);
            if (fs.existsSync(npmDir)) {
                console.log(`\n😊：${name}已安装成功!\n`)
            } else {
                console.log(`😭: ${name}安装失败了，请联系管理员！`)
            }
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }

    testInstall(name){
        try {
            console.log(`⌛️：帮您检查${name}......\n`);
            let result = shell.exec(name);
            if (result.stderr) {
                console.log(`\n😊：${name}还没有安装，赶快安装起来吧!\n`)
            } else {
                console.log(`\n😊：${name}已安装成功!\n`)
            }
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }

    crudDescription(){
        try {
            console.log(desc.crud)
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }
    md2jsDescription(){
        try {
            console.log(desc.md2js)
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }
    kmlDescription(){
        try {
            console.log(desc.kml)
        } catch (e) {
            console.error(`😭：出现bug了，先用其他功能吧！\n` + e)
        }
    }

}

module.exports = burgeon;
import { diskStorage, Options } from "multer";
import multer from "multer";
import { resolve } from "path";
import { randomBytes } from "crypto";

export const multerConfig = {
    // Local de armazenamento dos arquivos
    dest: resolve(__dirname, '..', '..', 'uploads'),

    // Configs do arquivo a ser armazenado
    // storage: multer.memoryStorage(),
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, resolve(__dirname, '..', '..', 'uploads'))
        },
        // Encriptando o arquivo para o usuario não o sobrescrever
        filename: (req, file, cb) => {
            randomBytes(16, (err, hash) => {
                // Se der algum erro na hora de encriptar, retorna o erro e o nome do arquivo
                if (err) {
                    cb(err, file.filename);
                }
                // const filename = `${file.originalname}`
                const filename = `${hash.toString('hex')}-${file.originalname}`
                cb(null, filename);
            });
        },
    }),

    // Tamanho máximo do arquivo
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    },

    // Filtrando os formatos permitidos
    fileFilter: (req, file, cb) => {
        const img_formats = [
            'image/jpeg',
            'image/jpg',
            'image/png',
        ];

        const file_formats = [
            'application/pdf'
        ];

        // Se for foto
        if (file.fieldname == "foto") {
            // Se o formato de arquivo inserido estiver na lista permitida
            if (img_formats.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Formato não aceito"))
            }
        } 

        // Se for arquivo
        else if (file.fieldname == "file") {
            // Se o formato de arquivo inserido estiver na lista permitida
            if (file_formats.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error("Formato não aceito"))            
            }
        }
    }

} as Options
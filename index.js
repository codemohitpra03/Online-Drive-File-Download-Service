require('dotenv').config()
const express = require('express');
const bodyparser=require('body-parser');

const cors = require('cors');


const {connectToMongoDB} = require('./connect.js')


const port = 5000;
const app = express();



const corsOptions = {
    
    origin: [''], //included origin as true
    credentials: true, //included credentials as true
};

app.use("*",cors());

connectToMongoDB()
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

const fs = require('fs');
const archiver = require('archiver');
const axios = require('axios');



const {FolderModel} = require('./models/FolderModel.js');
const { FileModel } = require('./models/FileModel.js');

async function downloadAndAddFileToZip(archive, fileUrl, fileName=null,filePath = null) {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    console.log(response.data);
    if(!filePath) {

        archive.append(response.data, { name: fileName });
    }else{

        archive.append(response.data, { name: filePath });
    }


}




function getChildFilesPathFromFolderId(folderId,pathFolder) {
    const fromFolder = pathFolder;
    if (!fromFolder) return ""; // Return empty string if fromFolderId not found
    console.log(fromFolder.path,fromFolder.name,"pm");
    const index = fromFolder.path.findIndex(folder => folder._id === folderId);
    if (index === -1) return ""; // Return empty string if folderId not found in path array

    const pathArray = fromFolder.path.slice(index).map(folder => folder.name);
    const pathval = pathArray.join("/") + '/'+fromFolder.name;
    
    return pathval

}


app.get('/download', async (req, res) => {
    const zipName = 'example.zip';
    const files = [
        { fileUrl: 'https://firebasestorage.googleapis.com/v0/b/auth-e09fc.appspot.com/o/files%2FjWqhEjpOPHdNY1xwmECs5oDJ4dA3%2F9000377.jpg?alt=media&token=2870a3ab-9700-4c77-b382-8fd052413810',
         fileName: 'files/file1.jpg' 
        },
        
        // Add more files as needed
    ];

    const output = fs.createWriteStream(zipName);
    const archive = archiver('zip');

    archive.pipe(output);

    // archive.directory('sdfsdfsd','/')
    archive.append(null,{name:'messi father of real madrid/a/b/'})
    

    for (const { fileUrl, fileName } of files) {
        await downloadAndAddFileToZip(archive, fileUrl, fileName);
    }

    archive.finalize();

    output.on('close', () => {
        res.download(zipName, 'example.zip', err => {
            if (err) {
                res.status(500).send('Error downloading the zip file.');
            } else {
                fs.unlink(zipName, () => {}); // Delete the zip file after download
            }
        });
    
        // res.download(zipName, {
        //     headers: {
        //         'Content-Type': 'application/zip',
        //         'Content-Disposition': `attachment; filename="${zipName}"`
        //     }
        // }, err => {
        //     if (err) {
        //         res.status(500).send('Error sending the zip file.');
        //     } else {
        //         // Delete the zip file after sending
        //         fs.unlink(zipName, () => {});
        //     }
        // });
    
    });

    archive.on('error', err => {
        res.status(500).send('Error creating the zip file.');
    });
});


app.post('/downloadfile', async(req, res) => {
    const {fileName,fileUrl} = req.body;
    console.log(fileName);
    // const fileName = 'java-file.png'
    // const fileUrl = 'https://firebasestorage.googleapis.com/v0/b/auth-e09fc.appspot.com/o/files%2FjWqhEjpOPHdNY1xwmECs5oDJ4dA3%2Fjava-file.png?alt=media&token=3a7a3602-d3ef-4e13-9fbe-630553a51924'
    const zipName = fileName+'.zip';

    const output = fs.createWriteStream(zipName);
    const archive = archiver('zip');

    archive.pipe(output);
    const downloads = []
    downloads.push(axios.get(fileUrl, { responseType: 'arraybuffer' }).then((response)=>{
        return {
            data:response.data,
            fileName: fileName
        }
    }))
    const results = await Promise.all(downloads)
    console.log(results[0]);
    results.map((result)=>{
        archive.append(result.data, { name: result.fileName });
    })

    // await downloadAndAddFileToZip(archive, fileUrl, fileName);

    archive.finalize();

    output.on('close', () => {
        res.download(zipName, fileName+'.zip', err => {
            if (err) {
                res.status(500).send('Error downloading the zip file.');
            } else {
                fs.unlink(zipName, () => {}); // Delete the zip file after download
            }
        });
    
    });

    archive.on('error', err => {
        res.status(500).send('Error creating the zip file.');
    });
    
})

app.post('/downloadfolder',async(req, res) => {
    // const folderId = '66393a512814d674363fa834'
    // const folderName = 'b'
    const {folderId,folderName} = req.body

    const zipName = folderName+'.zip';
    const output = fs.createWriteStream(zipName);
    const archive = archiver('zip');

    
    
    
    const childFolders = await FolderModel.find({ 'path._id': folderId }).exec();
    // const childFiles = await FileModel.find({ 'path._id': folderId }).exec();
    
    const nestedFiles = await FileModel.find({ 'path._id': folderId}).exec()
    // console.log([...childFiles,...nestedFiles]);
    
    archive.pipe(output);
    const files = [...nestedFiles];
    // const files = [...childFiles];
    console.log(files);

    // const path = getPathFromFolderId(folderId,childFolders[0]);
    // console.log(path,"pm");
    // archive.append(null,{name:(path+'/')})

    const downloads = []

    files.map(async(childFile)=>{
        console.log(getChildFilesPathFromFolderId(folderId,childFile));
        console.log(childFile.url);
        downloads.push(axios.get(childFile.url, { responseType: 'arraybuffer' }).then((response)=>{
            return {
                data:response.data,
                fileName: getChildFilesPathFromFolderId(folderId,childFile)
            }
        }))
        // await downloadA  ndAddFileToZip(archive, childFile.url, null,getChildFilesPathFromFolderId(folderId,childFile));
        
    })

    

    const results = await Promise.all(downloads)
    console.log(results[0]);
    results.map((result)=>{
        archive.append(result.data, { name: result.fileName });
    })

    // childFolders.map((childFolder)=>{
    //     const path = getChildFoldersPathFromFolderId(folderId,childFolder)
    //     console.log(path);
    //     archive.append(null,{name:(path+'/')})
    // })
    // const filep = getChildFilesPathFromFolderId(folderId,files[0])
    // console.log(files[0],filep);

    
    
    archive.finalize();
    
    await new Promise((resolve, reject) => {
        output.on('close', () => {
            res.download(zipName, folderName+'.zip', err => {
                if (err) {
                    // res.status(500).send('Error downloading the zip file.');
                    console.log(err);
                } else {
                    // resolve()
                    fs.unlink(zipName, () => {}); // Delete the zip file after download
                }
            });
        
            
        
        });
    });


    archive.on('error', err => {
        res.status(500).send('Error creating the zip file.');
    });
    res.json({'a':'a'})  
})

app.get('/',async(req,res)=>{
    
    return res.json(uid)
})


















app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

import firebase from 'firebase/app'

const storageRef = firebase.storage().ref('/public')
const dbRef = firebase.database().ref('/attachments')

const uploadFileToStorage = (file, fileName) => {
    return storageRef.child(fileName).put(file)
}

const insertIntoDb = (params) => {
    const pushObject = {
        timestamp: Date.now(),
        location: 'firebase',
        ...params
    }

    return dbRef.push(pushObject)
}

const getFileDownloadUrl = async (fileName) => {
    const fileSnapshot = await storageRef.child(fileName)
    return await fileSnapshot.metadata.ref.getDownloadURL()
}

const checkIfFileExist = (md5Hash) => {
    return dbRef.orderByChild('md5Hash').equalTo(md5Hash).once('value').then(snapshot => snapshot.exists())
}

export const uploadAttachment = async (file, fileName) => {
    const fileSnapshot = await uploadFileToStorage(file, fileName)
    const url = await fileSnapshot.metadata.ref.getDownloadURL()
    const md5Hash = fileSnapshot.metadata.md5Hash
    const fullPath = fileSnapshot.metadata.fullPath
    return insertIntoDb({fileName, fullPath, md5Hash, url})
}

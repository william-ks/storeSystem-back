const s3 = require("./aws");

const upload = async (path, buffer, mimetype) => {
  const Files = await s3
    .upload({
      Bucket: process.env.BUCKET, //buscar do .env
      Key: path,
      Body: buffer,
      ContentType: mimetype,
    })
    .promise();

  return {
    url: Files.Location,
    path: Files.Key,
  };
};

const list = async () => {
  const Files = await s3
    .listObjects({
      Bucket: process.env.BACKBLAZE_BUCKET,
    })
    .promise();

  const archives = Files.Contents.map((file) => {
    return {
      url: `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${file.Key}`,
      path: file.Key,
    };
  });

  return archives;
};

const del = async (path) => {
  await s3
    .deleteObject({
      Bucket: process.env.BACKBLAZE_BUCKET,
      Key: path,
    })
    .promise();
};

module.exports = {
  upload,
  list,
  del,
};

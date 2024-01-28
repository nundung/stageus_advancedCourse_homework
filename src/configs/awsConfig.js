//Import
const AWS = require("aws-sdk")

//aws region 및 자격증명 설정
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
});

/* S3에 있는 버킷 리스트 출력 */
const s3 = new AWS.S3();
s3.listBuckets().promise().then((data) => {
    console.log('S3 : ', JSON.stringify(data, null, 2));
});

/* EC2에 있는 인스턴스 리스트 출력 */
const ec2 = new AWS.EC2();
ec2.describeInstanceStatus().promise()
.then((data) => {
    console.log('EC2 : ', JSON.stringify(data, null, 2));
})

module.exports = AWS.config
use aws_sdk_s3::config::{Credentials, Region};
use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::Client;
use uuid::Uuid;

pub struct R2Uploader {
    access_key_id: String,
    secret_access_key: String,
    bucket_name: String,
    endpoint: String,
    public_domain: String,
}

impl R2Uploader {
    pub fn new(
        access_key_id: String,
        secret_access_key: String,
        bucket_name: String,
        endpoint: String,
        public_domain: String,
    ) -> Self {
        Self {
            access_key_id,
            secret_access_key,
            bucket_name,
            endpoint,
            public_domain,
        }
    }

    pub async fn upload(&self, image_data: &[u8], filename: &str) -> Result<String, String> {
        // Generate unique filename
        let extension = filename.split('.').last().unwrap_or("webp");
        let unique_filename = format!("{}.{}", Uuid::new_v4(), extension);

        // Create credentials
        let creds = Credentials::new(
            &self.access_key_id,
            &self.secret_access_key,
            None,
            None,
            "r2-uploader",
        );

        // Create config
        let region = Region::new("auto");
        let config = aws_sdk_s3::config::Builder::new()
            .credentials_provider(creds)
            .region(region)
            .endpoint_url(&self.endpoint)
            .build();

        let client = Client::from_conf(config);

        // Upload
        let byte_stream = ByteStream::from(image_data.to_vec());

        client
            .put_object()
            .bucket(&self.bucket_name)
            .key(&unique_filename)
            .body(byte_stream)
            .content_type("image/webp")
            .send()
            .await
            .map_err(|e| format!("Upload failed: {}", e))?;

        // Construct public URL
        let public_url = format!("{}/{}", self.public_domain.trim_end_matches('/'), unique_filename);

        Ok(public_url)
    }
}


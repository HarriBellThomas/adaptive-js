mkdir ../pkg-js && \
cp -r $TRAVIS_BUILD_DIR ../pkg-js && \
tar -czf travis-deploy-js.tgz ../pkg-js/adaptive-js && \
rm -rf ../pkg-js && \
openssl aes-256-cbc -K $encrypted_cbdb4f80c025_key -iv $encrypted_cbdb4f80c025_iv -in deploy.enc -out deploy-hbt-adaptive -d && \
chmod 0700 deploy-hbt-adaptive && \
ssh-add deploy-hbt-adaptive && \
scp -i deploy-hbt-adaptive travis-deploy-js.tgz $REMOTE_USER@$REMOTE_HOST:$REMOTE_APP_DIR && \
ssh $REMOTE_USER@$REMOTE_HOST 'bash -s' < ./scripts/untar.sh && \
echo "Ran SCP to production"

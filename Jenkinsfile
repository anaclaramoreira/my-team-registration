pipeline {
    agent any
    
    environment {
        TEST_RESULT_FILE = 'test_result.txt'
        REPO_URL = 'https://github.com/anaclaramoreira/my-team-registration.git'
        TESTING_SERVER = '98.80.72.55'
        PRODUCTION_SERVER = '54.221.84.176'
        SSH_CREDENTIAL_ID = 'ssh-key-id'
    }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building Website...'
            }
        }
        
        stage('Deploy to Testing') {
            steps {
                echo 'Deploying to Testing Server...'
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIAL_ID, keyFileVariable: 'SSH_KEY')]) {
                        try {
                            sh """
                                ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ec2-user@${TESTING_SERVER} '
                                    sudo rm -rf /var/www/html/*
                                    sudo git clone ${REPO_URL} /tmp/repo-temp
                                    sudo cp -r /tmp/repo-temp/* /var/www/html/
                                    sudo rm -rf /tmp/repo-temp
                                    sudo chown -R apache:apache /var/www/html
                                    sudo systemctl restart httpd
                                '
                            """
                            echo 'Successfully deployed to testing server'
                        } catch (Exception e) {
                            echo "Deployment to testing failed: ${e.getMessage()}"
                            currentBuild.result = 'FAILURE'
                            error('Failed to deploy to testing server')
                        }
                    }
                }
            }
        }
        
        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium Tests...'
                script {
                    try {
                        sleep(time: 5, unit: 'SECONDS')
                        
                        sh 'node selenium-tests/test_form.js'
                        writeFile file: env.TEST_RESULT_FILE, text: 'true'
                        echo 'Selenium tests passed!'
                    } catch (Exception e) {
                        writeFile file: env.TEST_RESULT_FILE, text: 'false'
                        echo "Selenium tests failed: ${e.getMessage()}"
                    }
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                expression {
                    if (fileExists(env.TEST_RESULT_FILE)) {
                        def result = readFile(env.TEST_RESULT_FILE).trim()
                        return result == 'true'
                    } else {
                        return false
                    }
                }
            }
            steps {
                echo 'Deploying to Production Server...'
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_CREDENTIAL_ID, keyFileVariable: 'SSH_KEY')]) {
                        try {
                            sh """
                                ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ec2-user@${PRODUCTION_SERVER} '
                                    sudo rm -rf /var/www/html/*
                                    sudo git clone ${REPO_URL} /tmp/repo-temp
                                    sudo cp -r /tmp/repo-temp/* /var/www/html/
                                    sudo rm -rf /tmp/repo-temp
                                    sudo chown -R apache:apache /var/www/html
                                    sudo systemctl restart httpd
                                '
                            """
                            echo 'Successfully deployed to production server!'
                        } catch (Exception e) {
                            echo "Production deployment failed: ${e.getMessage()}"
                            currentBuild.result = 'FAILURE'
                            error('Failed to deploy to production server')
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                if (fileExists(env.TEST_RESULT_FILE)) {
                    sh "rm -f ${env.TEST_RESULT_FILE}"
                }
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}

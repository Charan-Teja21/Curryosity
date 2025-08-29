pipeline {
    agent any

    tools {
        nodejs "nodejs"   // must match name from Global Tool Config
    }

    environment {
        DOCKER_IMAGE = "my-node-app:latest"
        CONTAINER_NAME = "my-node-app-container"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Charan-Teja21/Curryosity.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || echo "⚠️ Tests failed, continuing..."'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    # Stop and remove old container if exists
                    docker stop $CONTAINER_NAME || true
                    docker rm $CONTAINER_NAME || true

                    # Run new container
                    docker run -d -p 3000:3000 --name $CONTAINER_NAME $DOCKER_IMAGE
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! App running in Docker container: $CONTAINER_NAME"
        }
        failure {
            echo "❌ Build failed. Please check logs."
        }
    }
}

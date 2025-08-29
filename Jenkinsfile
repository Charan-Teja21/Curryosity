pipeline {
    agent any
    tools {
        nodejs "nodejs"   // this must match the name you gave in Global Tool Config
    }
    stages {
        stage('Verify Node & npm') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'which node'
                sh 'which npm'
            }
        }
    }
}
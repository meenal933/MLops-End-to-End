pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/meenal933/MLops-End-to-End'
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                cd caption
                docker build -t meenal933/caption:latest .

                cd ../frontend
                docker build -t meenal933/spefrontend:latest .

                cd ../object
                docker build -t meenal933/object:latest .
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin

                docker push meenal933/caption:latest
                docker push meenal933/spefrontend:latest
                docker push meenal933/object:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f kubernetes/
                '''
            }
        }
    }
}
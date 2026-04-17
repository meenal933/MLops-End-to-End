pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')
        KUBECONFIG = '/var/jenkins_home/.kube_config'
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/meenal933/MLops-End-to-End'
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

        docker push meenal933/caption:latest || true
        docker push meenal933/object:latest || true
        docker push meenal933/spefrontend:latest || true
        '''
    }
}

    stage('Deploy to Kubernetes') {
    steps {
        sh '''
        export KUBECONFIG=/var/jenkins_home/.kube/config

        kubectl delete -f kubernetes/backend-deployment.yaml || true

        kubectl apply -f kubernetes/backend-deployment.yaml
        kubectl apply -f kubernetes/frontend-deployment.yaml
        kubectl apply -f kubernetes/object-deployment.yaml
        '''
    }
}
    }
}

pipeline {
    agent {
        docker {
            image 'node:18-slim'
            args '-u root:root'
        }
    }

    environment {
        // Define environment variables if needed, such as API endpoints or keys
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'yarn install'
            }
        }
        stage('Build') {
            steps {
                sh 'yarn build'
            }
        }
        stage('Deploy Production') {
            when {
                branch 'main' 
            }
            steps {
                script {
                    sh 'npx next telemetry disable'
                    

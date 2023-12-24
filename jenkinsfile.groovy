pipeline {
    agent {
        docker {
            image 'node:18-slim'
            args '-u root:root' // Run as root if needed, or remove if not
        }
    }

    stages {
        stage('Deploy Production') {
            when {
                branch 'main' // Runs only when the branch is 'main'
            }
            steps {
                script {
                    sh 'npx next telemetry disable'
                    // Replace the following lines with your actual deployment script
                    // sh 'npm install'
                    // sh 'npm run build'
                    // Add your deployment commands here
                }
            }
        }
    }

    post {
        always {
            // Clean up the workspace to not leave anything behind
            cleanWs()
        }
    }
}

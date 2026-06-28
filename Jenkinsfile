pipeline {
  agent any
  tools {
        nodejs 'node20'      // must match the name from Step 2
    }
  stages {
    stage('Install Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }

    stage('Install Frontend') {
      steps {
        dir('app') {
          sh 'npm install'
        }
      }
    }

    stage('Build App') {
      steps {
        dir('app') {
          sh 'npx expo export --platform web'
        }
      }
    }

    stage('Test') {
      steps {
        sh 'echo "Running tests..."'
        // Add your test commands here
      }
    }
    stage('Deploy') {
    steps {
        sshagent(['vm-deploy-key']) {
            sh '''
                ssh -o StrictHostKeyChecking=no azureuser@20.211.41.139 "
                    cd ~/nt-fire-watch &&
                    git pull &&
                    docker compose up -d --build
                "
            '''
        }
    }
}
  }
}
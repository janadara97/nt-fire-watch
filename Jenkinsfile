pipeline {
  agent any

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
        sh 'echo "Deploying the application..."'
        // Add your deployment commands here
      }
    }
  }
}
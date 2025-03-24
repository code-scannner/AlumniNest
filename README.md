## APIs requests

@desc    Get all connections of a student
@route   GET /api/connect/ {header contains student token}
@access  Private (Only student can access their own connections)

@desc    Send a connection request
@route   POST /api/connect/request/<alumni_id> (for giving request to alumni) {header contains student token}
@access  Private (Students only)

@desc    Accept a connection request
@route   PUT /api/connect/accept/<student_id> (for accepting request from the alumni) {header contains alumni token}
@body {accept : <status> (according to model design)}
@access  Private (Alumni only)

@desc    Get all posts from a student's connected alumni
@route   GET /api/post/ {header contains student token}
@access  Private (Only student can access their connections' posts)

@desc    Create a new post
@route   POST /api/post
@body  {content : <text>}
@access  Private (Alumni only)



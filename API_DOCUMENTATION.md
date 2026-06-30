# Ping LMS - API Reference

> **Base URL:** `{API_BASE_URL}/v1`
> **Auth:** All protected routes require `Authorization: Bearer <token>`
> **Versioning:** All routes are prefixed with `/v1`. Breaking changes will be released under `/v2` while `/v1` is maintained through a deprecation window.

---

## Table of Contents

1. [Conventions](#conventions)
2. [Authentication](#authentication)
3. [Users & Profiles](#users--profiles)
4. [File Uploads](#file-uploads)
5. [Courses](#courses)
6. [Modules & Lessons](#modules--lessons)
7. [Assignments](#assignments)
8. [Submissions](#submissions)
9. [Grades](#grades)
10. [Announcements](#announcements)
11. [Notifications](#notifications)
12. [Reminders](#reminders)
13. [Dashboard](#dashboard)
14. [Planned Endpoints](#planned-endpoints)
15. [HTTP Status Codes](#http-status-codes)

---

## Conventions

### URL Design

Two patterns are used - choose based on whether context is **required** or optional:

| Pattern | When to use |
|---------|-------------|
| `/courses/:courseId/assignments` | Resource only makes sense within a parent (creation, scoped listing) |
| `/assignments/:assignmentId` | Direct access to a known resource by ID |

Nesting never goes deeper than **two levels**. Deep nesting like `/courses/:id/modules/:id/lessons/:id` is avoided - lesson access by ID uses `/lessons/:lessonId` directly.

---

### Pagination

All list endpoints are paginated. Requests accept:

| Param | Default | Description |
|-------|---------|-------------|
| `page` | `1` | Page number (1-indexed) |
| `limit` | `20` | Items per page (max `100`) |

Every paginated response uses this envelope:

```json
{
  "data": [...],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

Non-paginated responses (single resource, actions) return the resource or status directly - no envelope.

---

### Roles

| Role | Description |
|------|-------------|
| `student` | Enrolled learner |
| `teacher` | Course instructor |
| `admin` | Platform administrator - full access |

Role access is noted per-endpoint as: **Student** / **Teacher** / **Admin**.

---

### Error Shape

All errors return a consistent body:

```json
{
  "message": "Human-readable description of the error.",
  "code": "MACHINE_READABLE_CODE"
}
```

Validation errors return an additional `fields` map:

```json
{
  "message": "Validation failed.",
  "code": "VALIDATION_ERROR",
  "fields": {
    "email": "Must be a valid email address.",
    "dueDate": "Must be a future date."
  }
}
```

---

### Date Format

All dates are ISO 8601 UTC strings: `2024-12-14T23:59:00Z`

---

## Authentication

### `POST /v1/auth/login`

Authenticate and receive a JWT.

**Access:** Public

**Request**
```json
{
  "email": "student@university.edu",
  "password": "••••••••"
}
```

**Response `200`**
```json
{
  "token": "<jwt>",
  "user": {
    "id": "u_123",
    "email": "student@university.edu",
    "name": "Jane Doe",
    "role": "student"
  }
}
```

**Errors:** `401 INVALID_CREDENTIALS`

---

### `POST /v1/auth/logout`

Invalidate the current session token server-side.

**Access:** Authenticated

**Response `204`**

---

### `POST /v1/auth/forgot-password`

Trigger a password reset email.

**Access:** Public

**Request**
```json
{ "email": "student@university.edu" }
```

**Response `200`**
```json
{ "message": "If that email exists, a reset link has been sent." }
```

> Always returns `200` regardless of whether the email exists - prevents user enumeration.

---

### `POST /v1/auth/reset-password`

Complete a password reset using the token from the reset email.

**Access:** Public

**Request**
```json
{
  "token": "<reset_token>",
  "password": "new_secure_password"
}
```

**Response `200`**

**Errors:** `400 INVALID_OR_EXPIRED_TOKEN`

---

## Users & Profiles

### `GET /v1/users/me`

Return the full profile of the currently authenticated user.

**Access:** Authenticated

**Response `200`**
```json
{
  "id": "u_123",
  "name": "Jane Doe",
  "email": "student@university.edu",
  "role": "student",
  "avatarUrl": null,
  "studentId": "STU-20240183",
  "yearOfStudy": "3rd Year",
  "createdAt": "2024-09-01T00:00:00Z"
}
```

---

### `PATCH /v1/users/me`

Update the authenticated user's own profile.

**Access:** Authenticated

**Request** - all fields optional
```json
{
  "name": "Jane A. Doe",
  "avatarUrl": "https://storage.example.com/avatars/u_123.jpg"
}
```

**Response `200`** - Updated user object

> Email and role changes are **not** permitted here. Those require Admin action via `PATCH /v1/users/:userId`.

---

### `PATCH /v1/users/me/password`

Change the authenticated user's password.

**Access:** Authenticated

**Request**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

**Response `200`**

**Errors:** `400 INCORRECT_CURRENT_PASSWORD`

---

### `GET /v1/users`

List all users on the platform.

**Access:** Admin

**Query params:** `?role=student&search=jane&page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "u_789",
      "name": "Jane Doe",
      "email": "jane@university.edu",
      "role": "student",
      "createdAt": "2024-09-01T00:00:00Z"
    }
  ],
  "meta": { "total": 312, "page": 1, "limit": 20, "totalPages": 16 }
}
```

---

### `POST /v1/users`

Create a user account.

**Access:** Admin

**Request**
```json
{
  "name": "Jane Doe",
  "email": "jane@university.edu",
  "role": "student",
  "password": "temporary_password"
}
```

**Response `201`** - Created user object

**Errors:** `409 EMAIL_ALREADY_EXISTS`

---

### `GET /v1/users/:userId`

Get a single user's profile.

**Access:** Admin - any user. Teacher - only students enrolled in their courses.

**Response `200`** - User object

---

### `PATCH /v1/users/:userId`

Update any user's account (including role or email).

**Access:** Admin

**Request** - all fields optional
```json
{
  "name": "Jane Doe",
  "email": "new@university.edu",
  "role": "teacher",
  "yearOfStudy": "4th Year"
}
```

**Response `200`** - Updated user object

---

### `DELETE /v1/users/:userId`

Deactivate a user account. Soft-delete preferred - preserves historical grade and submission data.

**Access:** Admin

**Response `204`**

---

## File Uploads

> File uploads are a prerequisite for assignment submissions and avatar changes. This section is a first-class concern, not an afterthought.

### `POST /v1/uploads`

Upload a file and receive a permanent URL to reference in other requests (e.g. `POST /v1/assignments/:id/submissions`).

**Access:** Authenticated

**Request** - `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | ✓ | The file to upload |
| `context` | string | ✓ | `"submission"` \| `"avatar"` \| `"lesson-asset"` |

**Constraints by context:**

| Context | Allowed types | Max size |
|---------|--------------|----------|
| `submission` | PDF, DOCX, images | 20 MB |
| `avatar` | JPEG, PNG, WEBP | 2 MB |
| `lesson-asset` | PDF, images, video | 500 MB |

**Response `201`**
```json
{
  "url": "https://storage.example.com/uploads/abc123.pdf",
  "filename": "problem-set-4.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 204800,
  "context": "submission"
}
```

**Errors:** `400 UNSUPPORTED_FILE_TYPE`, `413 FILE_TOO_LARGE`

> The returned `url` is what you pass as `fileUrl` in submission and profile requests.

---

## Courses

### `GET /v1/courses`

List courses.

**Access:**
- **Student** - enrolled courses only
- **Teacher** - courses they teach only
- **Admin** - all courses

**Query params:** `?search=math&status=active&page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "c_456",
      "title": "Mathematics 101",
      "instructor": "Dr. Johnson",
      "instructorId": "u_teacher_001",
      "progress": 62,
      "taskCount": 4,
      "status": "active",
      "term": "Fall",
      "year": 2024,
      "enrolledCount": 28
    }
  ],
  "meta": { "total": 6, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `POST /v1/courses`

Create a course.

**Access:** Teacher, Admin

**Request**
```json
{
  "title": "Mathematics 101",
  "term": "Fall",
  "year": 2024,
  "status": "active"
}
```

**Response `201`** - Created course object

---

### `GET /v1/courses/:courseId`

Get a single course.

**Access:** Enrolled student, course teacher, Admin

**Response `200`** - Single course object

**Errors:** `403 FORBIDDEN`, `404 NOT_FOUND`

---

### `PATCH /v1/courses/:courseId`

Update course details.

**Access:** Teacher (own courses), Admin

**Request** - all fields optional
```json
{
  "title": "Mathematics 101 - Advanced",
  "status": "completed"
}
```

**Response `200`** - Updated course object

---

### `DELETE /v1/courses/:courseId`

Delete a course and all associated modules, lessons, assignments, and announcements.

**Access:** Admin

> Teachers cannot delete courses to protect historical student data. Use `status: "archived"` instead.

**Response `204`**

---

### `GET /v1/courses/:courseId/students`

List students enrolled in a course.

**Access:** Teacher (own courses), Admin

**Query params:** `?page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "u_789",
      "name": "Jane Doe",
      "email": "jane@university.edu",
      "progress": 62,
      "enrolledAt": "2024-09-01T00:00:00Z"
    }
  ],
  "meta": { "total": 28, "page": 1, "limit": 20, "totalPages": 2 }
}
```

---

### `POST /v1/courses/:courseId/enroll`

Enroll a student in a course.

**Access:** Teacher, Admin

**Request**
```json
{ "studentId": "u_789" }
```

**Response `200`**

**Errors:** `409 ALREADY_ENROLLED`, `404 USER_NOT_FOUND`

---

### `DELETE /v1/courses/:courseId/students/:studentId`

Remove a student from a course.

**Access:** Teacher (own courses), Admin

**Response `204`**

---

## Modules & Lessons

> Modules belong to a course. Lessons belong to a module. Neither resource is meaningful outside that hierarchy, so full nesting is appropriate here - but **stops at two levels**. Individual lesson access by ID uses a flat `/v1/lessons/:lessonId` route.

### `GET /v1/courses/:courseId/modules`

List all modules for a course.

**Access:** Enrolled student, course teacher, Admin

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "m_1",
      "courseId": "c_456",
      "title": "Algebra Fundamentals",
      "order": 1,
      "lessonCount": 4,
      "completedCount": 3
    }
  ],
  "meta": { "total": 4, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `POST /v1/courses/:courseId/modules`

Create a module.

**Access:** Teacher (own courses), Admin

**Request**
```json
{
  "title": "Algebra Fundamentals",
  "order": 1
}
```

**Response `201`** - Created module object

---

### `PATCH /v1/courses/:courseId/modules/:moduleId`

Update a module.

**Access:** Teacher (own courses), Admin

**Request** - all fields optional
```json
{
  "title": "Algebra Fundamentals - Revised",
  "order": 2
}
```

**Response `200`** - Updated module object

---

### `DELETE /v1/courses/:courseId/modules/:moduleId`

Delete a module and all its lessons.

**Access:** Teacher (own courses), Admin

**Response `204`**

---

### `GET /v1/courses/:courseId/modules/:moduleId/lessons`

List all lessons within a module.

**Access:** Enrolled student, course teacher, Admin

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "l_1-1",
      "moduleId": "m_1",
      "title": "Introduction to Variables",
      "type": "video",
      "duration": "8 min",
      "status": "completed",
      "order": 1,
      "description": "Learn what variables are and how they're used.",
      "overview": "Variables are symbols that stand in for unknown values..."
    }
  ],
  "meta": { "total": 4, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `POST /v1/courses/:courseId/modules/:moduleId/lessons`

Create a lesson.

**Access:** Teacher (own courses), Admin

**Request**
```json
{
  "title": "Introduction to Variables",
  "type": "video",
  "duration": "8 min",
  "description": "...",
  "overview": "...",
  "order": 1,
  "videoUrl": "https://storage.example.com/lessons/intro-variables.mp4"
}
```

**Response `201`** - Created lesson object

---

### `GET /v1/lessons/:lessonId`

Get a single lesson by ID - direct access without full course/module path.

**Access:** Enrolled student (course must be active), course teacher, Admin

**Response `200`** - Single lesson object

---

### `PATCH /v1/lessons/:lessonId`

Update a lesson.

**Access:** Teacher (own courses), Admin

**Request** - all fields optional

**Response `200`** - Updated lesson object

---

### `DELETE /v1/lessons/:lessonId`

Delete a lesson.

**Access:** Teacher (own courses), Admin

**Response `204`**

---

### `POST /v1/lessons/:lessonId/complete`

Mark a lesson as completed for the authenticated student. Idempotent - safe to call multiple times.

**Access:** Student

**Response `200`**
```json
{
  "lessonId": "l_1-1",
  "status": "completed",
  "moduleProgress": 75,
  "courseProgress": 42
}
```

---

## Assignments

> Assignments are created and listed under a course (`/v1/courses/:courseId/assignments`) but accessed directly by ID (`/v1/assignments/:assignmentId`). This avoids requiring the caller to know the course ID for every CRUD operation on a known assignment.

### `GET /v1/courses/:courseId/assignments`

List all assignments for a specific course.

**Access:** Enrolled student, course teacher, Admin

**Query params:** `?status=upcoming&page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "a_001",
      "courseId": "c_456",
      "courseName": "Mathematics 101",
      "instructor": "Dr. Johnson",
      "title": "Problem Set 4",
      "description": "Solve quadratic equations using both factoring and the quadratic formula.",
      "dueDate": "2024-12-14T23:59:00Z",
      "status": "upcoming",
      "points": 100,
      "submissionType": "file_upload",
      "gradingRubric": [
        { "criterion": "Accuracy", "points": 60 },
        { "criterion": "Working shown", "points": 40 }
      ],
      "reminderNote": "Due in 2 days"
    }
  ],
  "meta": { "total": 4, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `GET /v1/assignments`

List assignments across **all** of the authenticated user's courses. Useful for the global Assignments page.

**Access:**
- **Student** - all assignments across enrolled courses
- **Teacher** - all assignments across taught courses

**Query params:** `?status=upcoming&courseId=c_456&page=1&limit=20`

**Response `200`** - Same paginated shape as above

---

### `POST /v1/courses/:courseId/assignments`

Create an assignment within a course.

**Access:** Teacher (own courses), Admin

**Request**
```json
{
  "title": "Problem Set 4",
  "description": "...",
  "dueDate": "2024-12-14T23:59:00Z",
  "points": 100,
  "submissionType": "file_upload",
  "gradingRubric": [
    { "criterion": "Accuracy", "points": 60 },
    { "criterion": "Working shown", "points": 40 }
  ]
}
```

**Response `201`** - Created assignment object

---

### `GET /v1/assignments/:assignmentId`

Get a single assignment by ID.

**Access:** Enrolled student (own course), course teacher, Admin

**Response `200`** - Single assignment object

**Errors:** `403 FORBIDDEN`, `404 NOT_FOUND`

---

### `PATCH /v1/assignments/:assignmentId`

Update an assignment.

**Access:** Teacher (own course), Admin

**Request** - all fields optional
```json
{
  "title": "Problem Set 4 - Revised",
  "dueDate": "2024-12-16T23:59:00Z",
  "points": 110
}
```

**Response `200`** - Updated assignment object

---

### `DELETE /v1/assignments/:assignmentId`

Delete an assignment and all associated submissions.

**Access:** Teacher (own course), Admin

**Response `204`**

---

## Submissions

> Submissions are treated as a sub-resource of assignments. This keeps the assignment endpoint clean while allowing teachers to list and review all submissions for a given assignment.

### `POST /v1/assignments/:assignmentId/submissions`

Submit work for an assignment. Upload the file first via `POST /v1/uploads` and pass the returned URL here.

**Access:** Student (enrolled, assignment not past a grace period)

**Request**
```json
{
  "fileUrl": "https://storage.example.com/uploads/abc123.pdf",
  "content": "Optional plain-text notes to the instructor."
}
```

**Response `201`**
```json
{
  "id": "sub_001",
  "assignmentId": "a_001",
  "studentId": "u_789",
  "fileUrl": "https://storage.example.com/uploads/abc123.pdf",
  "content": "Optional plain-text notes.",
  "status": "submitted",
  "submittedAt": "2024-12-13T10:22:00Z"
}
```

**Errors:** `409 ALREADY_SUBMITTED`, `403 ASSIGNMENT_CLOSED`

---

### `GET /v1/assignments/:assignmentId/submissions`

List all student submissions for an assignment.

**Access:** Teacher (own course), Admin

**Query params:** `?page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "sub_001",
      "studentId": "u_789",
      "studentName": "Jane Doe",
      "fileUrl": "https://storage.example.com/uploads/abc123.pdf",
      "status": "submitted",
      "submittedAt": "2024-12-13T10:22:00Z",
      "grade": null
    }
  ],
  "meta": { "total": 24, "page": 1, "limit": 20, "totalPages": 2 }
}
```

---

### `GET /v1/assignments/:assignmentId/submissions/:submissionId`

Get a single submission.

**Access:** Student (own submission only), Teacher (own course), Admin

**Response `200`** - Single submission object

---

### `PATCH /v1/assignments/:assignmentId/submissions/:submissionId`

Update a submission's status - e.g. return for revision.

**Access:** Teacher (own course), Admin

**Request**
```json
{
  "status": "returned",
  "feedback": "Please revise part (b) and resubmit."
}
```

**Response `200`** - Updated submission object

---

## Grades

### `GET /v1/grades`

List grades across all of the authenticated user's courses.

**Access:**
- **Student** - own grades only
- **Teacher** - grades for all assessments in their courses
- **Admin** - all grades

**Query params:** `?courseId=c_456&page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "g_001",
      "courseId": "c_456",
      "courseName": "Mathematics 101",
      "assignmentId": "a_001",
      "studentId": "u_789",
      "title": "Problem Set 4",
      "score": 88,
      "maxScore": 100,
      "feedback": "Good work on part (b).",
      "gradedAt": "2024-12-10T14:00:00Z"
    }
  ],
  "meta": { "total": 12, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `POST /v1/grades`

Record a grade for a student's submission.

**Access:** Teacher, Admin

**Request**
```json
{
  "courseId": "c_456",
  "assignmentId": "a_001",
  "studentId": "u_789",
  "title": "Problem Set 4",
  "score": 88,
  "maxScore": 100,
  "feedback": "Good work on part (b).",
  "gradedAt": "2024-12-10T14:00:00Z"
}
```

**Response `201`** - Created grade object

**Errors:** `409 GRADE_ALREADY_EXISTS` - use `PATCH` to update

---

### `GET /v1/grades/:gradeId`

Get a single grade record.

**Access:** Student (own grade), Teacher (own course), Admin

**Response `200`** - Single grade object

---

### `PATCH /v1/grades/:gradeId`

Update a grade - e.g. after re-marking.

**Access:** Teacher (own course), Admin

**Request**
```json
{
  "score": 90,
  "feedback": "Awarded extra credit for alternative method."
}
```

**Response `200`** - Updated grade object

---

### `DELETE /v1/grades/:gradeId`

Delete a grade entry.

**Access:** Teacher (own course), Admin

**Response `204`**

---

## Announcements

> `isNew` is **not** a field on the announcement object. Whether an announcement is "new" to a user is derived server-side by comparing `announcement.createdAt` against `courseEnrollment.lastAnnouncementReadAt` for that user. The client receives a computed `isUnread: boolean` field.

### `GET /v1/courses/:courseId/announcements`

List announcements for a course. Pinned items always appear first, then newest first.

**Access:** Enrolled student (sets `lastAnnouncementReadAt` on response), course teacher, Admin

**Query params:** `?page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "ann_001",
      "courseId": "c_456",
      "title": "Problem Set 4 - Clarification on Question 3",
      "body": "Several students have asked...",
      "author": "Dr. Johnson",
      "authorId": "u_teacher_001",
      "isPinned": true,
      "isUnread": true,
      "createdAt": "2024-12-13T09:00:00Z",
      "updatedAt": "2024-12-13T09:00:00Z"
    }
  ],
  "meta": { "total": 4, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `POST /v1/courses/:courseId/announcements`

Create an announcement. Triggers a notification to all enrolled students.

**Access:** Teacher (own courses), Admin

**Request**
```json
{
  "title": "No Class on Nov 29",
  "body": "There will be no lecture on Friday November 29...",
  "isPinned": false
}
```

**Response `201`** - Created announcement object

---

### `PATCH /v1/courses/:courseId/announcements/:announcementId`

Edit an announcement.

**Access:** Teacher (author or own course), Admin

**Request** - all fields optional
```json
{
  "title": "Updated title",
  "body": "Updated body.",
  "isPinned": true
}
```

**Response `200`** - Updated announcement object

---

### `DELETE /v1/courses/:courseId/announcements/:announcementId`

Delete an announcement.

**Access:** Teacher (author or own course), Admin

**Response `204`**

---

## Notifications

### `GET /v1/notifications`

List all notifications for the authenticated user, newest first.

**Query params:** `?isRead=false&page=1&limit=20`

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "n_001",
      "title": "Assignment graded",
      "body": "Problem Set 4 has been graded in Mathematics 101.",
      "isRead": false,
      "createdAt": "2024-12-10T14:05:00Z"
    }
  ],
  "meta": { "total": 8, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `GET /v1/notifications/count`

Lightweight unread count for polling (e.g. the header badge). Does not return notification objects.

**Response `200`**
```json
{ "count": 3 }
```

---

### `PATCH /v1/notifications/:notificationId`

Mark a single notification as read or unread.

**Request**
```json
{ "isRead": true }
```

**Response `200`** - Updated notification object

---

### `POST /v1/notifications/read-all`

Mark all of the authenticated user's notifications as read.

**Response `200`**
```json
{ "updated": 5 }
```

---

### `DELETE /v1/notifications/:notificationId`

Permanently dismiss a single notification.

**Response `204`**

### `DELETE /v1/notifications`

Permanently dismiss **all** notifications for the authenticated user.

**Response `204`**

---

## Reminders

### `GET /v1/reminders`

List active reminders for the authenticated user.

**Response `200`** - Paginated
```json
{
  "data": [
    {
      "id": "r_001",
      "title": "Problem Set 4 due soon",
      "detail": "Mathematics 101 · Dec 14 at 11:59 PM",
      "dueDate": "2024-12-14T23:59:00Z",
      "isUrgent": true
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

### `POST /v1/reminders`

Create a custom reminder.

**Access:** Student

**Request**
```json
{
  "title": "Revise for exam",
  "detail": "Mathematics 101 final exam",
  "dueDate": "2024-12-20T09:00:00Z"
}
```

**Response `201`** - Created reminder object

---

### `DELETE /v1/reminders/:reminderId`

Dismiss a single reminder.

**Response `204`**

---

### `DELETE /v1/reminders`

Dismiss **all** active reminders for the authenticated user.

**Response `204`**

---

## Dashboard

> The dashboard returns role-specific aggregates. Rather than one endpoint with a shape that varies unpredictably by role, stats are split by role. Each endpoint is independently typed, documented, and testable.

### `GET /v1/dashboard/student`

Aggregated stats for the authenticated student.

**Access:** Student

**Response `200`**
```json
{
  "activeCourses": 4,
  "pendingAssignments": 3,
  "averageGrade": 79,
  "assignmentsDueThisWeek": 2
}
```

---

### `GET /v1/dashboard/teacher`

Aggregated stats for the authenticated teacher.

**Access:** Teacher

**Response `200`**
```json
{
  "activeCourses": 3,
  "totalStudents": 87,
  "pendingSubmissions": 12,
  "averageClassGrade": 74,
  "assignmentsPublishedThisWeek": 1
}
```

---

## Planned Endpoints

| Endpoint | Description | Role |
|----------|-------------|------|
| `GET /v1/courses/:courseId/progress` | Per-student progress breakdown for a course | Teacher, Admin |
| `GET /v1/reports/grades` | Aggregate grade report across all courses with export support | Teacher, Admin |
| `GET /v1/courses/:courseId/calendar` | Scoped calendar of deadlines and lessons | Student, Teacher |
| `GET /v1/calendar` | Global calendar across all courses | Student, Teacher |
| `PATCH /v1/submissions/:submissionId/resubmit` | Allow a student to resubmit after a "returned" status | Student |
| `POST /v1/courses/:courseId/modules/:moduleId/reorder` | Batch-reorder lessons within a module | Teacher, Admin |
| `POST /v1/courses/:courseId/modules/reorder` | Batch-reorder modules within a course | Teacher, Admin |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request - validation or semantic error |
| `401` | Unauthorized - missing or expired token |
| `403` | Forbidden - authenticated but insufficient role or ownership |
| `404` | Not Found |
| `409` | Conflict - e.g. duplicate enrollment, grade already exists |
| `413` | Payload Too Large - file upload exceeds limit |
| `422` | Unprocessable Entity - request is well-formed but logically invalid |
| `500` | Internal Server Error |
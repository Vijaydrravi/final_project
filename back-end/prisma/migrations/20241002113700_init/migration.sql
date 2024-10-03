-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "designation" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'employee',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficulty_level" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseAssignment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,
    "assignment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceRating" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "assignment_id" INTEGER NOT NULL,

    CONSTRAINT "PerformanceRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceSummary" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "average_rating" DOUBLE PRECISION NOT NULL,
    "learning_path_id" INTEGER NOT NULL,

    CONSTRAINT "PerformanceSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" SERIAL NOT NULL,
    "is_certified" BOOLEAN NOT NULL,
    "assignment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
C

-- CreateTable
CREATE TABLE "CourseLearningPath" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "learning_path_id" INTEGER NOT NULL,

    CONSTRAINT "CourseLearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceRating_assignment_id_key" ON "PerformanceRating"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceSummary_user_id_key" ON "PerformanceSummary"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Certificates_assignment_id_key" ON "Certificates"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "CourseLearningPath_course_id_learning_path_id_key" ON "CourseLearningPath"("course_id", "learning_path_id");

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAssignment" ADD CONSTRAINT "CourseAssignment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceRating" ADD CONSTRAINT "PerformanceRating_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "CourseAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceRating" ADD CONSTRAINT "PerformanceRating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceSummary" ADD CONSTRAINT "PerformanceSummary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceSummary" ADD CONSTRAINT "PerformanceSummary_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "CourseAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLearningPath" ADD CONSTRAINT "CourseLearningPath_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseLearningPath" ADD CONSTRAINT "CourseLearningPath_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

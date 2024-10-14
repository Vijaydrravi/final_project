-- CreateTable
CREATE TABLE "SuggestedLearningPath" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "learning_path_id" INTEGER NOT NULL,

    CONSTRAINT "SuggestedLearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SuggestedLearningPath_user_id_learning_path_id_key" ON "SuggestedLearningPath"("user_id", "learning_path_id");

-- AddForeignKey
ALTER TABLE "SuggestedLearningPath" ADD CONSTRAINT "SuggestedLearningPath_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestedLearningPath" ADD CONSTRAINT "SuggestedLearningPath_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "LearningPath"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

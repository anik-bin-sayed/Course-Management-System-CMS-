"use client";

import { useSearchParams } from "@/lib/navigation";

import React, { Suspense } from "react";

import Loader from "../../../../../utils/Loader";
import EditCourseForm from "./EditCourseForm";
import { useGetCourseBySlugQuery } from "../../../../../lib/features/courses/free-course-api";

const EditCourse = () => {
  const searchParams = useSearchParams();

  const slug = searchParams.get("slug");
  const { data, isLoading } = useGetCourseBySlugQuery(slug);

  if (isLoading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <EditCourseForm editData={data} />
    </Suspense>
  );
};

export default EditCourse;

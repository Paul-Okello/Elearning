'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Web Developer",
    content: "The courses on EduLearn have been instrumental in advancing my career. The instructors are top-notch and the content is always up-to-date."
  },
  {
    name: "Sarah Lee",
    role: "Data Scientist",
    content: "I've taken multiple data science courses on EduLearn, and they've all been excellent. The hands-on projects really helped solidify my learning."
  },
  {
    name: "Michael Brown",
    role: "UX Designer",
    content: "As someone transitioning into UX design, EduLearn's courses provided me with the perfect foundation. I landed my first job within months of completing the courses!"
  }
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-lg mb-4">{testimonials[currentIndex].content}</p>
          <div>
            <p className="font-semibold">{testimonials[currentIndex].name}</p>
            <p className="text-sm text-gray-500">{testimonials[currentIndex].role}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center mt-4 space-x-2">
        <Button variant="outline" size="icon" onClick={prevTestimonial}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimonial</span>
        </Button>
        <Button variant="outline" size="icon" onClick={nextTestimonial}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </div>
  )
}


"use client"
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from '@/lib/validator';
import { eventDefaultValues } from '@/constants';
import DropDown from './DropDown';
import { Textarea } from '../ui/textarea';
import FileUploader from './FileUploader';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from '../ui/checkbox';
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from 'next/navigation';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';

const EventForm = ({ userId, type, event , eventId  }) => {
    const router = useRouter();
    const initialValues = event && type === "Update" ? {
        ...event,
        startDateTime: event.startDateTime ? new Date(event.startDateTime) : new Date(),
        endDateTime: event.endDateTime ? new Date(event.endDateTime) : new Date()
    } : eventDefaultValues;

    const { startUpload } = useUploadThing('imageUploader');

    const form = useForm({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues
    });

    const [files, setFiles] = useState([]);
    
    async function onSubmit(values) {
        let uploadedImageUrl = values.imageUrl;
    
        if(files.length > 0) {
          const uploadedImages = await startUpload(files)
    
          if(!uploadedImages) {
            return
          }
    
          uploadedImageUrl = uploadedImages[0].url
        }
    
        if(type === 'Create') {
          try {
            const newEvent = await createEvent({
              event: { ...values, imageUrl: uploadedImageUrl },
              userId,
              path: '/profile'
            })
    
            if(newEvent) {
              form.reset();
              router.push(`/events/${newEvent._id}`)
            }
          } catch (error) {
            console.log(error);
          }
        }

        if(type === "Update"){
            try {
                const updatedEvent = await updateEvent({
                    userId,
                    event: { ...values, imageUrl: uploadedImageUrl , _id:eventId},
                    path : `/events/${eventId}`
                })

                if(updatedEvent){
                    form.reset()
                    router.push(`/events/${updatedEvent._id}`)
                }
            } catch (error) {
                console.log(error)
            }
        }


    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Event Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <DropDown onChangeHandler={field.onChange} value={field.value} />
                                    
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-72">
                                    <Textarea placeholder="Description" {...field} className="rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-72">
                                    <FileUploader onFieldChange={field.onChange} imageUrl={field.value} setFiles={setFiles} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2'>
                                        <Image src="/assets/icons/location-grey.svg" alt='location' width={24} height={24} />
                                        <Input placeholder="Event Location or Online" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-col gap-5 md:flex-row'>
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2'>
                                        <Image src="/assets/icons/calendar.svg" alt='calendar' width={24} height={24} />
                                        <p className='ml-3 text-gray-600'>Start Date : </p>
                                        <DatePicker selected={field.value} onChange={(date) => field.onChange(date)} showTimeSelect timeInputLabel='Time' dateFormat="MM/dd/yy h:mm aa" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2'>
                                        <Image src="/assets/icons/calendar.svg" alt='calendar' width={24} height={24} />
                                        <p className='ml-3 text-gray-600'>End Date : </p>
                                        <DatePicker selected={field.value} onChange={(date) => field.onChange(date)} showTimeSelect timeInputLabel='Time' dateFormat="MM/dd/yy h:mm aa" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row items-center">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2'>
                                        <Image src="/assets/icons/dollar.svg" alt='price' width={24} height={24} />
                                        <input type="number" placeholder='price' {...field} className='bg-gray-50 border-0 focus-visible:ring-0' />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className='flex items-center'>
                                        <label htmlFor='isFree' className='pr-3'>IsFree Ticket</label>
                                        <Checkbox id="isFree" checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <div className='flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2 gap-5'>
                                    <Image src="/assets/icons/link.svg" alt='link' width={24} height={24} />
                                    <input type="text" placeholder='Event URL' {...field} className='w-full bg-gray-50 border-0 focus-visible:ring-0' />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="bg-blue-600 w-full">
                    {form.formState.isSubmitting ? 'Submitting...' : `${type} Event`}
                </Button>
            </form>
        </Form>
    );
};

export default EventForm;

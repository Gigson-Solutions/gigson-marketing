import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClientArgs } from 'payload';
import { importMap } from './importMap';
import config from '@payload-config';
import React from 'react';
import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

const serverFunction = async function (args: ServerFunctionClientArgs) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default async function Layout({ children }: Args) {
  return RootLayout({ config, importMap, serverFunction, children });
}

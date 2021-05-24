<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\UtilsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractController
{


    /**
     * @Route("/admin/create-password/{email}/{pass}", name="admin_create_password", methods="GET")
     */
    public function adminCreatePassword($email, $pass, UserPasswordEncoderInterface $encoder)
    {

        $user = null;
        $encodepass = null;

        $user = $this->getDoctrine()
            ->getRepository(User::class)
            ->findOneBy([
                'email' => $email,
                'status' => User::ENABLED,
                'type' => User::ADMIN
            ]);


        if($user != null){
            $em = $this->getDoctrine()->getManager();
            $encodepass = $encoder->encodePassword($user, $pass);
            $user->setPassword($encodepass);
            $em->persist($user);
            $em->flush();
        }

        return $this->json([
            'pass' => $encodepass,
        ]);

    }

    /**
     * @Route("/probando", name="probando", methods="GET")
     */
    public function probando()
    {

        return $this->json([
            'pass' => 'todo ok.',
        ]);

    }

    /**
     * @Route("/admin/login", name="admin_login", methods="POST")
     */
    public function adminLogin(UserPasswordEncoderInterface $encoder)
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $user = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $email = $data->user->email;
            $password = $data->user->password;

            $user = $this->getDoctrine()
                ->getRepository(User::class)
                ->findOneBy([
                    'email' => $email,
                    'status' => User::ENABLED,
                    'type' => User::ADMIN
                ]);

            if($user != null){

                if ($encoder->isPasswordValid($user, $password)){
                    $code = 200;
                    $message = "Cards success";
                }else{
                    $user = null;
                    $message = "La constraseña es incorrecta";
                }

            }else{
                $message = "Este email no existe";
            }

        }else{

            $message = "No tiene permiso para realizar esta acción.";

        }

        return $this->json([
            'user' => $user,
            'code' => $code,
            'message' => $message
        ]);


    }

    /**
     * @Route("/get/user", name="get_users", methods="POST")
     */
    public function getUsers()
    {

        $request = Request::createFromGlobals();
        $data = json_decode($request->get('json'));
        $token = $request->get('h');
        $time = $request->get('t');
        $cards = null;
        $code = 0;
        $message = 'Ha ocurrido un error';

        if (UtilsService::isRoot($token, $time)) {

            $users = $this->getDoctrine()
                ->getRepository(User::class)
                ->findBy([
                    'active' => User::ENABLED
                ]);

            $code = 200;
            $message = "Cards success";

        }else{
            $message = "No tiene permiso para realizar esta acción.";
        }

        return $this->json([
            'users' => $users,
            'code' => $code,
            'message' => $message
        ]);

    }

}
